import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { getEntity } from '@/api/entity'
import { MapPin, Mail, Phone, CalendarDays, ShieldCheck } from 'lucide-react'

function formatDob(dob) {
  return new Date(dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function formatPhone(phone) {
  const d = phone.replace(/\D/g, '')
  return `(${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7)}`
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground/50">
        <Icon size={13} strokeWidth={1.75} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm text-foreground/80 mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export default function Header({ title }) {
  const entity = getEntity()
  const { individual, address } = entity
  const fullName = `${individual.first_name} ${individual.last_name}`
  const fullAddress = `${address.line1}${address.line2 ? ', ' + address.line2 : ''}, ${address.city}, ${address.state} ${address.zip}`

  return (
    <header className="h-14 px-6 flex items-center justify-between border-b border-white/8">
      <h1 className="text-sm font-medium text-foreground/70">{title}</h1>

      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-white/6 transition-colors">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground/90 leading-none">{fullName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Personal</p>
            </div>
            <Avatar className="h-8 w-8 border border-white/15">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                {individual.first_name[0]}{individual.last_name[0]}
              </AvatarFallback>
            </Avatar>
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          sideOffset={8}
          className="w-72 p-0 glass-strong border border-white/12 shadow-2xl rounded-2xl overflow-hidden"
        >
          {/* Profile header */}
          <div className="px-5 pt-5 pb-4 flex items-center gap-4">
            <Avatar className="h-12 w-12 border border-white/15">
              <AvatarFallback className="bg-primary/20 text-primary text-base font-semibold">
                {individual.first_name[0]}{individual.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base font-semibold text-foreground/90">{fullName}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <ShieldCheck size={11} strokeWidth={1.75} className="text-emerald-400" />
                <span className="text-xs text-emerald-400 capitalize">{entity.status}</span>
              </div>
            </div>
          </div>

          <Separator className="opacity-20" />

          {/* Info rows */}
          <div className="px-5 py-4 space-y-3.5">
            <InfoRow icon={Mail}        label="Email"    value={individual.email} />
            <InfoRow icon={Phone}       label="Phone"    value={formatPhone(individual.phone)} />
            <InfoRow icon={CalendarDays} label="Date of Birth" value={formatDob(individual.dob)} />
            <InfoRow icon={MapPin}      label="Address"  value={fullAddress} />
          </div>

          <Separator className="opacity-20" />

          <div className="px-5 py-3">
            <p className="text-[10px] text-muted-foreground/50">
              Member since {formatDate(entity.created_at)}
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </header>
  )
}
