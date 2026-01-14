import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Event, EventCategory, FamilyMember, RecurrenceType, DayOfWeek } from '@/lib/types'

interface EventDialogProps {
  event?: Event
  members: FamilyMember[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (event: Omit<Event, 'id' | 'createdAt'> & { id?: string }) => void
}

export function EventDialog({ event, members, open, onOpenChange, onSave }: EventDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<EventCategory>('other')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [assignedTo, setAssignedTo] = useState<string>('')
  const [allDay, setAllDay] = useState(false)
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none')
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('')
  const [recurringDays, setRecurringDays] = useState<DayOfWeek[]>([])

  const weekDays: { value: DayOfWeek; label: string }[] = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' },
  ]

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setDescription(event.description)
      setCategory(event.category)
      const eventDate = new Date(event.date)
      setDate(eventDate.toISOString().split('T')[0])
      setTime(event.time || '')
      setAssignedTo(event.assignedTo || '')
      setAllDay(event.allDay)
      setRecurrence(event.recurrence)
      setRecurrenceEndDate(event.recurrenceEndDate ? new Date(event.recurrenceEndDate).toISOString().split('T')[0] : '')
      setRecurringDays(event.recurringDays || [])
    } else {
      setTitle('')
      setDescription('')
      setCategory('other')
      setDate('')
      setTime('')
      setAssignedTo('')
      setAllDay(false)
      setRecurrence('none')
      setRecurrenceEndDate('')
      setRecurringDays([])
    }
  }, [event, open])

  const handleDayToggle = (day: DayOfWeek) => {
    setRecurringDays((current) =>
      current.includes(day)
        ? current.filter((d) => d !== day)
        : [...current, day]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !date) return

    const dateObj = new Date(date)
    const endDateObj = recurrenceEndDate ? new Date(recurrenceEndDate) : undefined
    
    onSave({
      id: event?.id,
      title: title.trim(),
      description: description.trim(),
      category,
      date: dateObj.getTime(),
      time: allDay ? undefined : time,
      assignedTo: assignedTo || undefined,
      allDay,
      recurrence,
      recurrenceEndDate: endDateObj?.getTime(),
      recurringDays: recurrence === 'weekly' && recurringDays.length > 0 ? recurringDays : undefined,
      parentEventId: event?.parentEventId,
    })
    
    onOpenChange(false)
  }

  const getCategoryLabel = (cat: EventCategory) => {
    const labels = {
      sports: 'Sports Practice',
      school: 'School Event',
      medical: 'Medical Appointment',
      social: 'Social Event',
      other: 'Other',
    }
    return labels[cat]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">
            {event ? 'Edit Event' : 'Add New Event'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-title">Event Title</Label>
            <Input
              id="event-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Soccer practice"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-description">Description</Label>
            <Textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Location and details..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-category">Category</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as EventCategory)}>
                <SelectTrigger id="event-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sports">{getCategoryLabel('sports')}</SelectItem>
                  <SelectItem value="school">{getCategoryLabel('school')}</SelectItem>
                  <SelectItem value="medical">{getCategoryLabel('medical')}</SelectItem>
                  <SelectItem value="social">{getCategoryLabel('social')}</SelectItem>
                  <SelectItem value="other">{getCategoryLabel('other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-member">Assign To (Optional)</Label>
              <Select value={assignedTo || "everyone"} onValueChange={(value) => setAssignedTo(value === "everyone" ? "" : value)}>
                <SelectTrigger id="event-member">
                  <SelectValue placeholder="Everyone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="everyone">Everyone</SelectItem>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-date">Date</Label>
              <Input
                id="event-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-time">Time</Label>
              <Input
                id="event-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={allDay}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="all-day" className="cursor-pointer">All Day Event</Label>
              <p className="text-xs text-muted-foreground">No specific time</p>
            </div>
            <Switch
              id="all-day"
              checked={allDay}
              onCheckedChange={setAllDay}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-recurrence">Recurrence</Label>
            <Select value={recurrence} onValueChange={(value) => setRecurrence(value as RecurrenceType)}>
              <SelectTrigger id="event-recurrence">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Does not repeat</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {recurrence === 'weekly' && (
            <div className="space-y-3">
              <Label>Repeat On</Label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map((day) => (
                  <div key={day.value} className="flex items-center">
                    <Button
                      type="button"
                      variant={recurringDays.includes(day.value) ? "default" : "outline"}
                      size="sm"
                      className="w-14"
                      onClick={() => handleDayToggle(day.value)}
                    >
                      {day.label}
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Select which days of the week this event repeats
              </p>
            </div>
          )}

          {recurrence !== 'none' && (
            <div className="space-y-2">
              <Label htmlFor="recurrence-end">Repeat Until (Optional)</Label>
              <Input
                id="recurrence-end"
                type="date"
                value={recurrenceEndDate}
                onChange={(e) => setRecurrenceEndDate(e.target.value)}
                min={date}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to repeat indefinitely
              </p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {event ? 'Save Changes' : 'Add Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
