export default function Crest({ team, logo, side }) {
  return (
    <span className={`crest ${side}`} title={team}>
      {logo ? <img src={logo} alt={team} loading="lazy" /> : initials(team)}
    </span>
  )
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}
