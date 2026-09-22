import { profile } from '@/data/profile'

// Profile photo, or initials until a photo is added in profile.ts.
export function Portrait() {
  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <div className="size-24 overflow-hidden rounded-full border-2 border-line bg-surface md:size-28">
      {profile.photo ? (
        <img
          src={profile.photo}
          alt={`Photo of ${profile.name}`}
          className="size-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="grid size-full place-items-center font-mono text-3xl font-medium text-accent"
        >
          {initials}
        </div>
      )}
    </div>
  )
}
