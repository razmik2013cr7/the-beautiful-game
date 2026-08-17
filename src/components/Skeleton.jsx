export function Skeleton({ width, height = 20, radius, style, className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius: radius || 8,
        ...style,
      }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="meta" style={{ marginBottom: 12 }}>
        <Skeleton width={60} height={14} />
        <Skeleton width={80} height={14} />
      </div>
      <div className="scoreboard" style={{ marginBottom: 12 }}>
        <div className="team">
          <Skeleton width={52} height={52} radius="50%" style={{ margin: '0 auto 8px' }} />
          <Skeleton width={90} height={14} style={{ margin: '0 auto' }} />
        </div>
        <Skeleton width={60} height={28} />
        <div className="team">
          <Skeleton width={52} height={52} radius="50%" style={{ margin: '0 auto 8px' }} />
          <Skeleton width={90} height={14} style={{ margin: '0 auto' }} />
        </div>
      </div>
      <div className="meta">
        <Skeleton width={140} height={12} />
      </div>
    </div>
  )
}

export function SkeletonPost() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="meta" style={{ marginBottom: 10 }}>
        <Skeleton width={50} height={14} />
        <Skeleton width={70} height={14} />
      </div>
      <Skeleton width="80%" height={20} style={{ marginBottom: 10 }} />
      <Skeleton width="100%" height={14} style={{ marginBottom: 6 }} />
      <Skeleton width="90%" height={14} style={{ marginBottom: 6 }} />
      <Skeleton width="60%" height={14} />
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="table-wrap">
      <table className="standings">
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}><Skeleton width={40} height={12} /></th>
            <th><Skeleton width={40} height={12} /></th>
            <th><Skeleton width={40} height={12} /></th>
            <th><Skeleton width={40} height={12} /></th>
            <th><Skeleton width={40} height={12} /></th>
            <th><Skeleton width={40} height={12} /></th>
            <th><Skeleton width={40} height={12} /></th>
            <th><Skeleton width={40} height={12} /></th>
            <th><Skeleton width={40} height={12} /></th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <tr key={i}>
              <td style={{ textAlign: 'left' }}><Skeleton width={120} height={14} /></td>
              <td><Skeleton width={30} height={14} style={{ margin: '0 auto' }} /></td>
              <td><Skeleton width={30} height={14} style={{ margin: '0 auto' }} /></td>
              <td><Skeleton width={30} height={14} style={{ margin: '0 auto' }} /></td>
              <td><Skeleton width={30} height={14} style={{ margin: '0 auto' }} /></td>
              <td><Skeleton width={30} height={14} style={{ margin: '0 auto' }} /></td>
              <td><Skeleton width={30} height={14} style={{ margin: '0 auto' }} /></td>
              <td><Skeleton width={30} height={14} style={{ margin: '0 auto' }} /></td>
              <td><Skeleton width={30} height={14} style={{ margin: '0 auto' }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
