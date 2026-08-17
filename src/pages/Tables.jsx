import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  addManualTable,
  getLeagueFlag,
  getLeagueTables,
  removeManualTable,
  updateManualTable,
} from '../store.js'
import { useI18n } from '../i18n.jsx'
import { useAuth } from '../auth.jsx'
import { useAsync } from '../useAsync.js'
import { useHead } from '../useHead.js'
import AdminOnly from '../components/AdminOnly.jsx'
import { SkeletonTable } from '../components/Skeleton.jsx'

const EMPTY_ROW = { team: '', p: '', w: '', d: '', l: '', gf: '', ga: '', pts: '' }
const NUM = ['p', 'w', 'd', 'l', 'gf', 'ga', 'pts']

function COLUMNS(t) {
  return [
    { key: 'p', label: t('colPlayed') },
    { key: 'w', label: t('colWon') },
    { key: 'd', label: t('colDrawn') },
    { key: 'l', label: t('colLost') },
    { key: 'gf', label: t('colGf') },
    { key: 'ga', label: t('colGa') },
    { key: 'pts', label: t('colPts') },
  ]
}
export default function Tables() {
  const { t } = useI18n()
  const { isAdmin } = useAuth()
  useHead('metaTables', 'metaTablesDesc')
  const { data: tables = [], loading, refresh } = useAsync(getLeagueTables)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [competition, setCompetition] = useState('')
  const [rows, setRows] = useState([EMPTY_ROW])
  const [error, setError] = useState('')
  const [selectedLeague, setSelectedLeague] = useState('all')

  const filtered = selectedLeague === 'all' ? tables : tables.filter((t) => t.competition === selectedLeague)

  const openNew = () => {
    setEditing(null)
    setCompetition('')
    setRows([EMPTY_ROW])
    setError('')
    setShowForm(true)
  }

  const openEdit = (table) => {
    setEditing(table.competition)
    setCompetition(table.competition)
    setRows(
      table.standings.map((r) => ({
        team: r.team,
        p: r.p,
        w: r.w,
        d: r.d,
        l: r.l,
        gf: r.gf,
        ga: r.ga,
        pts: r.pts,
      })),
    )
    setError('')
    setShowForm(true)
  }

  const close = () => {
    setShowForm(false)
    setEditing(null)
    setError('')
  }

  const setRow = (i, key) => (e) => {
    const next = rows.map((r, j) => (j === i ? { ...r, [key]: e.target.value } : r))
    setRows(next)
  }

  const submit = async (e) => {
    e.preventDefault()
    const clean = competition.trim()
    const filled = rows
      .filter((r) => r.team.trim())
      .map((r) => ({
        team: r.team.trim(),
        p: parseInt(r.p, 10) || 0,
        w: parseInt(r.w, 10) || 0,
        d: parseInt(r.d, 10) || 0,
        l: parseInt(r.l, 10) || 0,
        gf: parseInt(r.gf, 10) || 0,
        ga: parseInt(r.ga, 10) || 0,
        pts: parseInt(r.pts, 10) || 0,
      }))
    if (!clean || filled.length === 0) {
      setError(t('tableRowsError'))
      return
    }
    try {
      if (editing) {
        await updateManualTable(editing, filled)
      } else {
        await addManualTable(clean, filled)
      }
      close()
      refresh()
    } catch (err) {
      setError(err.message || String(err))
    }
  }

  const remove = async (table) => {
    await removeManualTable(table.competition)
    refresh()
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{t('tablesTitle')}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{t('tablesSub')}</p>
        </div>
        <AdminOnly>
          {!showForm ? (
            <button type="button" className="btn-primary" onClick={openNew}>
              {t('addTableBtn')}
            </button>
          ) : (
            <button type="button" className="btn-ghost" onClick={close}>
              {t('cancel')}
            </button>
          )}
        </AdminOnly>
      </div>

      {isAdmin && showForm && (
        <form className="form table-editor" onSubmit={submit}>
          <div className="field">
            <label htmlFor="tableCompetition">{t('tableCompetition')}</label>
            <input
              id="tableCompetition"
              placeholder="Serie A"
              value={competition}
              onChange={(e) => {
                setCompetition(e.target.value)
                setError('')
              }}
              required
            />
          </div>

          <div className="standings-editor-head">
            <span className="t-name">{t('colTeam')}</span>
            {COLUMNS(t).map(({ key, label }) => (
              <span key={key} className="num">
                {label}
              </span>
            ))}
            <span />
          </div>

          {rows.map((row, i) => (
            <div className="standings-editor-row" key={i}>
              <input
                className="t-name"
                placeholder="Team"
                value={row.team}
                onChange={setRow(i, 'team')}
              />
              {NUM.map((k) => (
                <input
                  key={k}
                  className="num"
                  type="number"
                  min={k === 'pts' ? undefined : '0'}
                  value={row[k]}
                  onChange={setRow(i, k)}
                />
              ))}
              <button
                type="button"
                className="btn-danger"
                onClick={() => setRows(rows.filter((_, j) => j !== i))}
                title={t('removeRow')}
              >
                ✕
              </button>
            </div>
          ))}

          <div className="form-actions">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setRows((r) => [...r, { ...EMPTY_ROW }])}
            >
              {t('addRowBtn')}
            </button>
            <button type="submit" className="btn-primary">
              {editing ? t('saveTable') : t('createTable')}
            </button>
          </div>

          {error && (
            <p style={{ color: 'var(--danger)', fontSize: 14, margin: '0 0 12px' }}>{error}</p>
          )}
        </form>
      )}

      {loading ? (
        <SkeletonTable />
      ) : tables.length === 0 ? (
        <div className="empty">
          <div className="empty-title">{t('noTables')}</div>
          <p>{t('noTablesHint')}</p>
          <div className="empty-actions">
            {isAdmin && (
              <button type="button" className="btn-primary" onClick={openNew}>
                {t('addTableBtn')}
              </button>
            )}
            <Link to="/matches" className="btn-primary">
              {t('goToMatches')}
            </Link>
          </div>
        </div>
      ) : (
        <>
          {tables.length > 1 && (
            <div className="league-filter">
              <label htmlFor="leagueSelect">{t('viewLeague')}</label>
              <select
                id="leagueSelect"
                className="league-select"
                value={selectedLeague}
                onChange={(e) => setSelectedLeague(e.target.value)}
              >
                <option value="all">{t('allLeagues')}</option>
                {tables.map((tbl) => (
                  <option key={tbl.competition} value={tbl.competition}>
                    {getLeagueFlag(tbl.competition)} {tbl.competition}
                  </option>
                ))}
              </select>
            </div>
          )}
          {filtered.map((table) => (
          <section key={table.competition} style={{ marginBottom: 32 }}>
            <div className="section-title" style={{ marginTop: 0 }}>
              <h2>
                {getLeagueFlag(table.competition) && (
                  <span style={{ marginRight: 8 }}>{getLeagueFlag(table.competition)}</span>
                )}
                {table.competition}
                {table.manual && <span className="badge badge-muted">{t('manualBadge')}</span>}
              </h2>
              <div className="rule" />
              {isAdmin && table.manual && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => openEdit(table)}
                    title={t('editTable')}
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => remove(table)}
                    title={t('deleteTable')}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            <div className="table-wrap">
              <table className="standings">
                <thead>
                  <tr>
                    <th>{t('colPos')}</th>
                    <th className="t-left">{t('colTeam')}</th>
                    <th>{t('colPlayed')}</th>
                    <th>{t('colWon')}</th>
                    <th>{t('colDrawn')}</th>
                    <th>{t('colLost')}</th>
                    <th>{t('colGf')}</th>
                    <th>{t('colGa')}</th>
                    <th>{t('colGd')}</th>
                    <th>{t('colPts')}</th>
                  </tr>
                </thead>
                <tbody>
                  {table.standings.map((row, i) => {
                    const gd = row.gf - row.ga
                    return (
                      <tr key={row.team} className={i === 0 ? 'leader' : ''}>
                        <td className="num">{i + 1}</td>
                        <td className="t-name">{row.team}</td>
                        <td className="num">{row.p}</td>
                        <td className="num">{row.w}</td>
                        <td className="num">{row.d}</td>
                        <td className="num">{row.l}</td>
                        <td className="num">{row.gf}</td>
                        <td className="num">{row.ga}</td>
                        <td className="num gd">{gd > 0 ? `+${gd}` : gd}</td>
                        <td className="num pts">{row.pts}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
          ))}
        </>
      )}
    </div>
  )
}
