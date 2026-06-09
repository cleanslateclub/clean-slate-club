import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PARENT_FOLDER_NAME = 'Provider Documents';

// Find a Google Drive folder by name, optionally scoped to a parent folder
async function findFolder(accessToken: string, name: string, parentId: string | null = null) {
  let query = `mimeType='application/vnd.google-apps.folder' and name='${name}' and trashed=false`;
  if (parentId) query += ` and '${parentId}' in parents`;

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const data = await res.json();
  return data.files?.[0] || null;
}

// Create a Google Drive folder
async function createFolder(accessToken: string, name: string, parentId: string | null = null) {
  const metadata: Record<string, unknown> = {
    name,
    mimeType: 'application/vnd.google-apps.folder',
  };
  if (parentId) metadata.parents = [parentId];

  const res = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });
  return await res.json();
}

// Upload a file to Google Drive using multipart upload
async function uploadFile(
  accessToken: string,
  fileName: string,
  mimeType: string,
  fileBase64: string,
  folderId: string
) {
  const boundary = 'b_' + crypto.randomUUID().replace(/-/g, '');
  const metadata = JSON.stringify({ name: fileName, parents: [folderId] });

  const body = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    metadata,
    `--${boundary}`,
    `Content-Type: ${mimeType}`,
    'Content-Transfer-Encoding: base64',
    '',
    fileBase64,
    `--${boundary}--`,
  ].join('\r\n');

  const res = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body,
    }
  );
  return await res.json();
}

// Map document type keys to Provider entity field names
const DOC_FIELD_MAP: Record<string, { onFileField: string; expiryField: string | null; label: string }> = {
  w9:                   { onFileField: 'w9_on_file',                label: 'W9',                    expiryField: null },
  drivers_license:      { onFileField: 'drivers_license_on_file',   label: "Driver's License",      expiryField: 'drivers_license_expiry' },
  vehicle_insurance:    { onFileField: 'vehicle_insurance_on_file', label: 'Vehicle Insurance',     expiryField: 'vehicle_insurance_expiry' },
  background_check:     { onFileField: 'background_check_cleared',  label: 'Background Check',     expiryField: 'background_check_expiry' },
  cpr_certification:    { onFileField: 'cpr_certification_on_file', label: 'CPR Certification',    expiryField: 'cpr_expiry' },
  contractor_agreement: { onFileField: 'contractor_agreement_signed', label: 'Contractor Agreement', expiryField: 'contract_signed_date' },
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const {
      providerId,
      providerName,
      providerEmail,
      documentType,
      fileName,
      fileBase64,
      mimeType = 'application/pdf',
      expiryDate,
    } = await req.json();

    // Validate required fields
    if (!providerId || !documentType || !fileBase64 || !fileName || !providerName) {
      return Response.json({ success: false, error: 'Missing required fields: providerId, providerName, documentType, fileName, fileBase64.' }, { status: 400 });
    }

    const mapping = DOC_FIELD_MAP[documentType];
    if (!mapping) {
      return Response.json({ success: false, error: `Unknown document type: ${documentType}. Valid types: ${Object.keys(DOC_FIELD_MAP).join(', ')}` }, { status: 400 });
    }

    // Get Google Drive access token via existing Google connector
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    // Step 1: Find or create root "Provider Documents" folder
    let parentFolder = await findFolder(accessToken, PARENT_FOLDER_NAME);
    if (!parentFolder) {
      parentFolder = await createFolder(accessToken, PARENT_FOLDER_NAME);
    }
    if (!parentFolder?.id) {
      return Response.json({ success: false, error: 'Could not find or create root Provider Documents folder in Google Drive.' }, { status: 500 });
    }

    // Step 2: Find or create provider subfolder (named after provider)
    // Sanitize name to remove characters that could cause issues in Drive folder names
    const safeName = providerName.replace(/[<>:"/\\|?*]/g, '').trim() || providerEmail;
    let providerFolder = await findFolder(accessToken, safeName, parentFolder.id);
    if (!providerFolder) {
      providerFolder = await createFolder(accessToken, safeName, parentFolder.id);
    }
    if (!providerFolder?.id) {
      return Response.json({ success: false, error: `Could not find or create folder for provider: ${safeName}` }, { status: 500 });
    }

    // Step 3: Upload the file into the provider's folder
    const uploaded = await uploadFile(accessToken, fileName, mimeType, fileBase64, providerFolder.id);
    if (!uploaded?.id) {
      console.error('Drive upload response:', uploaded);
      return Response.json({ success: false, error: 'File upload to Google Drive failed. Check that your Google connector has drive.file scope.' }, { status: 500 });
    }

    const driveUrl = uploaded.webViewLink || `https://drive.google.com/file/d/${uploaded.id}/view`;

    // Step 4: Merge Drive URL into provider's existing document_drive_urls object
    const provider = await base44.asServiceRole.entities.Provider.get(providerId);
    const existingUrls = provider?.document_drive_urls || {};

    const providerUpdate: Record<string, unknown> = {
      document_drive_urls: { ...existingUrls, [documentType]: driveUrl },
      [mapping.onFileField]: true,
    };

    // Save expiry date if provided and the document type supports it
    if (expiryDate && mapping.expiryField) {
      providerUpdate[mapping.expiryField] = expiryDate;
    }

    await base44.asServiceRole.entities.Provider.update(providerId, providerUpdate);

    // Step 5: Notify admin by email
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'cleanslateclubpa@gmail.com',
      subject: `📄 New document uploaded: ${mapping.label} — ${providerName}`,
      body: [
        `${providerName} has uploaded a new contractor document.`,
        ``,
        `Document: ${mapping.label}`,
        `Provider: ${providerName} (${providerEmail})`,
        expiryDate ? `Expiry date: ${expiryDate}` : null,
        ``,
        `View in Google Drive: ${driveUrl}`,
        ``,
        `View provider in admin dashboard: https://cleanslateclub.co/admin`,
      ].filter(Boolean).join('\n'),
    });

    return Response.json({
      success: true,
      driveUrl,
      fileId: uploaded.id,
      message: `${mapping.label} uploaded successfully.`,
    });

  } catch (error) {
    console.error('uploadProviderDocument error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});
