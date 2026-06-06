import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import CalendarEvent from '@/components/provider/CalendarEvent';
import BookingDetailPopup from '@/components/provider/BookingDetailPopup';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';

export default function ProviderCalendar({ timeBlocks, bookings, selectedWeek, onWeekChange, onTimeBlockUpdate, user, onQuickBook, onStartVisit }) {
  const [view, setView] = useState('week');
  const [selectedDateForBooking, setSelectedDateForBooking] = useState(null);
  const [selectedTimeForBooking, setSelectedTimeForBooking] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Get week dates
  const getWeekDates = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(date.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates(selectedWeek);
  
  // Group blocks by day
  const blocksByDay = useMemo(() => {
    const grouped = {};
    weekDates.forEach(d => {
      grouped[d.toISOString().split('T')[0]] = [];
    });
    timeBlocks.forEach(block => {
      if (grouped[block.date]) {
        grouped[block.date].push(block);
      }
    });
    return grouped;
  }, [timeBlocks, weekDates]);

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const blockId = draggableId.split('-')[1];
    const block = timeBlocks.find(b => b.id === blockId);
    if (!block) return;

    // Calculate new date from drop location
    const newDate = weekDates[parseInt(destination.droppableId)]?.toISOString().split('T')[0];
    if (newDate && newDate !== block.date) {
      onTimeBlockUpdate(blockId, { date: newDate });
    }
  };

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="bg-white rounded-3xl border border-taupe/15 shadow-sm p-8 overflow-visible">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-taupe/10">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-charcoal mb-1">Calendar</h2>
          <p className="font-body text-sm text-charcoal/50">Week of {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const d = new Date(selectedWeek);
              d.setDate(d.getDate() - 7);
              onWeekChange(d);
            }}
            className="p-2 hover:bg-cream rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-charcoal/40" />
          </button>
          <button
            onClick={() => onWeekChange(new Date())}
            className="px-4 py-2 text-xs font-body text-charcoal/50 hover:bg-cream rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => {
              const d = new Date(selectedWeek);
              d.setDate(d.getDate() + 7);
              onWeekChange(d);
            }}
            className="p-2 hover:bg-cream rounded-lg transition-colors"
          >
            <ChevronRight size={20} className="text-charcoal/40" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-7 gap-1 bg-cream/50 rounded-2xl p-1">
          {weekDates.map((date, dayIdx) => {
            const dateStr = date.toISOString().split('T')[0];
            const dayBlocks = blocksByDay[dateStr] || [];
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            return (
              <div
                key={dateStr}
                className={`rounded-xl border border-taupe/10 p-3 min-h-[500px] transition-colors ${
                  isToday ? 'bg-coral/5 border-coral/20' : 'bg-white'
                }`}
              >
                {/* Day header */}
                <div className="mb-3 pb-2 border-b border-taupe/10">
                  <p className="font-body text-xs font-light text-charcoal/50 uppercase tracking-widest">{dayLabels[dayIdx]}</p>
                  <p className={`font-heading text-lg font-semibold ${isToday ? 'text-coral' : 'text-charcoal'}`}>
                    {date.getDate()}
                  </p>
                </div>

                {/* Quick book button */}
                <button
                  onClick={() => {
                    setSelectedDateForBooking(dateStr);
                    setSelectedTimeForBooking('10:00 AM');
                    onQuickBook?.(dateStr, '10:00 AM');
                  }}
                  className="mb-2 w-full px-2 py-1.5 rounded-lg border border-dashed border-coral/30 bg-coral/5 text-coral text-xs font-body font-light hover:border-coral/50 hover:bg-coral/10 transition-all flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Book
                </button>

                {/* Droppable zone */}
                <Droppable droppableId={dayIdx.toString()}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-2 min-h-[400px] ${snapshot.isDraggingOver ? 'bg-coral/5 rounded-lg p-2' : ''}`}
                    >
                      {dayBlocks
                        .sort((a, b) => a.start_time.localeCompare(b.start_time))
                        .map((block, idx) => (
                          <Draggable key={block.id} draggableId={`block-${block.id}`} index={idx}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={snapshot.isDragging ? 'opacity-50' : ''}
                              >
                                <CalendarEvent
                                   block={block}
                                   booking={bookings.find(b => b.id === block.booking_id)}
                                   onUpdate={onTimeBlockUpdate}
                                   onClick={() => {
                                     const booking = bookings.find(b => b.id === block.booking_id);
                                     if (booking) setSelectedBooking(booking);
                                   }}
                                   onStartVisit={onStartVisit ? () => {
                                     const booking = bookings.find(b => b.id === block.booking_id);
                                     if (booking) onStartVisit(booking);
                                   } : null}
                                 />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <p className="text-xs font-body text-charcoal/30 font-light mt-6 text-center">
        Drag appointments to reschedule them across days
      </p>

      {selectedBooking && <BookingDetailPopup booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
    </div>
  );
}