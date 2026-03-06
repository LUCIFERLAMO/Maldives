import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch
import matplotlib.patheffects as pe

fig, ax = plt.subplots(figsize=(24, 18))
ax.set_xlim(0, 24)
ax.set_ylim(0, 18)
ax.axis('off')
fig.patch.set_facecolor('#FFFFFF')

TEAL_HDR  = '#0D9488'
NAVY      = '#0F172A'
TEAL_DARK = '#134E4A'
TEAL_LIGHT= '#CCFBF1'
LINE_CLR  = '#0F172A'
TEXT_CLR  = '#1E293B'
WHITE     = '#FFFFFF'
GRAY_BG   = '#F8FAFC'

# ── TITLE ─────────────────────────────────────────────────────────────────────
ax.text(12, 17.4, 'GlobalAKJobs — Entity Relationship Diagram (ERD)',
        ha='center', va='center', fontsize=20, fontweight='bold',
        color=TEAL_DARK, fontfamily='DejaVu Sans')
ax.text(12, 17.0, 'Database: GlobalAKJobs-DB  |  Platform: MongoDB Atlas  |  NoSQL Document-Oriented',
        ha='center', va='center', fontsize=10, color='#64748B')

# ── ENTITY HELPER ─────────────────────────────────────────────────────────────
def draw_entity(ax, x, y, w, h, name, fields, pk_fields=None):
    """Draw an entity box: header (teal) + field rows."""
    header_h = 0.55
    row_h    = 0.32
    total_h  = header_h + len(fields) * row_h
    # Outer shadow
    shadow = FancyBboxPatch((x+0.06, y-0.06), w, total_h,
                             boxstyle='round,pad=0.04', linewidth=0,
                             facecolor='#CBD5E1', zorder=1)
    ax.add_patch(shadow)
    # Header
    hdr = FancyBboxPatch((x, y + total_h - header_h), w, header_h,
                          boxstyle='round,pad=0.04', linewidth=1.5,
                          edgecolor=TEAL_DARK, facecolor=TEAL_HDR, zorder=2)
    ax.add_patch(hdr)
    ax.text(x + w/2, y + total_h - header_h/2, name,
            ha='center', va='center', fontsize=10, fontweight='bold',
            color=WHITE, zorder=3)
    # Body
    body = FancyBboxPatch((x, y), w, total_h - header_h,
                           boxstyle='round,pad=0.02', linewidth=1.5,
                           edgecolor='#94A3B8', facecolor=GRAY_BG, zorder=2)
    ax.add_patch(body)
    # Fields
    for i, field in enumerate(fields):
        fy = y + (total_h - header_h) - (i + 0.6) * row_h
        is_pk = pk_fields and any(field.startswith(p) for p in pk_fields)
        weight = 'bold' if is_pk else 'normal'
        color  = TEAL_DARK if is_pk else TEXT_CLR
        prefix = '🔑 ' if is_pk else '   '
        ax.text(x + 0.15, fy, prefix + field,
                ha='left', va='center', fontsize=7.5,
                fontweight=weight, color=color, zorder=3)
    # Return centre points for relationship lines
    cx = x + w/2
    return {
        'cx': cx, 'cy': y + total_h/2,
        'top':    (cx, y + total_h),
        'bottom': (cx, y),
        'left':   (x,  y + total_h/2),
        'right':  (x+w,y + total_h/2),
        'total_h': total_h
    }

# ── DRAW ENTITIES ─────────────────────────────────────────────────────────────
entities = {}

# PROFILES — central hub
entities['profiles'] = draw_entity(ax, 8.5, 7.2, 3.4, 0,
    'PROFILES',
    ['_id  (ObjectId — PK)', 'id  (UUID — unique)', 'role  (ADMIN|AGENT|CANDIDATE)',
     'full_name', 'email  (unique)', 'password', 'contact_number',
     'agency_name', 'skills  [ ]', 'avatar  (Base64)',
     'experience_years', 'location', 'savedJobs  [ ]',
     'status', 'agencyId  → agencies._id',
     'googleId', 'resetPasswordToken'],
    pk_fields=['_id', 'id'])

# JOBS — right
entities['jobs'] = draw_entity(ax, 16.5, 9.5, 3.2, 0,
    'JOBS',
    ['_id  (ObjectId — PK)', 'id  (UUID — unique)', 'title', 'company',
     'location', 'category  (enum)', 'salary_range',
     'description', 'requirements  [ ]', 'vacancies',
     'status  (OPEN|CLOSED)', 'posted_date'],
    pk_fields=['_id', 'id'])

# APPLICATIONS — bottom right
entities['applications'] = draw_entity(ax, 14.5, 1.8, 3.6, 0,
    'APPLICATIONS',
    ['_id  (ObjectId — PK)', 'id  (UUID — unique)',
     'job_id  → jobs.id', 'agent_id  → profiles.id  (opt)',
     'candidate_name', 'email', 'contact_number',
     'resume  { filename, data }', 'identity  { filename, data }',
     'certificates  { filename, data }', 'pcc  { filename, data }',
     'goodStanding  { filename, data }',
     'status  (PENDING|REVIEWING…)',
     'visibility_request_status', 'applied_at'],
    pk_fields=['_id', 'id'])

# AGENCIES — top right
entities['agencies'] = draw_entity(ax, 16.5, 13.5, 3.2, 0,
    'AGENCIES',
    ['_id  (ObjectId — PK)', 'name  (unique)', 'email',
     'contact', 'location', 'logo',
     'status  (Pending|Active|Rejected)',
     'description', 'website'],
    pk_fields=['_id'])

# JOBREQUESTS — left
entities['jobrequests'] = draw_entity(ax, 0.8, 8.8, 3.4, 0,
    'JOBREQUESTS',
    ['_id  (ObjectId — PK)', 'id  (UUID — unique)',
     'agent_id  → profiles.id', 'agent_name', 'agent_email',
     'agency_name', 'title', 'company', 'location',
     'category  (enum)', 'salary_range', 'description',
     'requirements  [ ]', 'vacancies',
     'status  (PENDING|APPROVED|REJECTED)',
     'reviewed_by', 'review_notes', 'reviewed_at',
     'approved_job_id  → jobs.id'],
    pk_fields=['_id', 'id'])

# NOTIFICATIONS — bottom left
entities['notifications'] = draw_entity(ax, 0.8, 1.5, 3.2, 0,
    'NOTIFICATIONS',
    ['_id  (ObjectId — PK)', 'userId  → profiles.id  (idx)',
     'title', 'message',
     'type  (JOB_ALERT|APP_UPDATE|SYSTEM)',
     'metadata.jobId', 'metadata.applicationId',
     'isRead  (Boolean)', 'createdAt'],
    pk_fields=['_id'])

# SUBSCRIPTIONS — bottom centre
entities['subscriptions'] = draw_entity(ax, 9.0, 1.5, 3.2, 0,
    'SUBSCRIPTIONS',
    ['_id  (ObjectId — PK)',
     'userId  → profiles.id  (idx)',
     'jobId  → jobs.id',
     'createdAt',
     '★ Compound Unique Index', '  { userId + jobId }'],
    pk_fields=['_id'])

# DOCUMENTS — top left
entities['documents'] = draw_entity(ax, 0.8, 13.8, 3.0, 0,
    'DOCUMENTS',
    ['_id  (ObjectId — PK)',
     'user_id  → profiles.id  (idx)',
     'document_type  (RESUME|PASSPORT…)',
     'filename', 'content_type  (MIME)',
     'file_data  (Base64)',
     'created_at'],
    pk_fields=['_id'])

# CATEGORIES — far right
entities['categories'] = draw_entity(ax, 20.5, 13.5, 2.8, 0,
    'CATEGORIES',
    ['_id  (ObjectId — PK)',
     'name  (Hospitality|IT…)',
     'createdAt'],
    pk_fields=['_id'])

# ── RELATIONSHIP LINES ────────────────────────────────────────────────────────
def arrow(ax, x1, y1, x2, y2, label='', lbl_offset=(0,0), color=LINE_CLR):
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle='-|>', color=color,
                                lw=1.4, mutation_scale=14),
                zorder=5)
    if label:
        mx = (x1+x2)/2 + lbl_offset[0]
        my = (y1+y2)/2 + lbl_offset[1]
        ax.text(mx, my, label, ha='center', va='center', fontsize=7.5,
                color=color, style='italic',
                bbox=dict(facecolor='white', edgecolor='none', alpha=0.85, pad=1),
                zorder=6)

def card(ax, x, y, text, color=TEAL_DARK):
    ax.text(x, y, text, ha='center', va='center', fontsize=8,
            fontweight='bold', color=WHITE, zorder=7,
            bbox=dict(facecolor=color, edgecolor='none',
                      boxstyle='round,pad=0.2', alpha=0.9))

# profiles → agencies  (Many:1)
p = entities['profiles']; a = entities['agencies']
arrow(ax, p['right'][0], p['top'][1]-1.0, a['left'][0], a['cy'],
      label='belongs to', lbl_offset=(0, 0.3))
card(ax, p['right'][0]+0.3, p['top'][1]-1.0, 'N')
card(ax, a['left'][0]-0.3, a['cy'], '1')

# applications → jobs  (Many:1)
ap = entities['applications']; j = entities['jobs']
arrow(ax, ap['right'][0], ap['cy']+0.5, j['bottom'][0], j['bottom'][1]+0.1,
      label='applied for', lbl_offset=(0.5, 0))
card(ax, ap['right'][0]+0.3, ap['cy']+0.5, 'N')
card(ax, j['bottom'][0], j['bottom'][1]-0.3, '1')

# applications → profiles  (Many:1, optional — agent submits)
arrow(ax, ap['top'][0], ap['top'][1], p['bottom'][0]+0.3, p['bottom'][1],
      label='submitted by\n(agent, opt.)', lbl_offset=(1.2, 0))
card(ax, ap['top'][0]+0.3, ap['top'][1]+0.2, 'N')
card(ax, p['bottom'][0]+0.6, p['bottom'][1]-0.3, '1')

# jobrequests → profiles  (Many:1)
jr = entities['jobrequests']
arrow(ax, jr['right'][0], jr['cy']+1.0, p['left'][0], p['cy']+0.5,
      label='submitted by', lbl_offset=(0, 0.3))
card(ax, jr['right'][0]+0.3, jr['cy']+1.0, 'N')
card(ax, p['left'][0]-0.3, p['cy']+0.5, '1')

# jobrequests → jobs  (1:1 after approval)
arrow(ax, jr['top'][0], jr['top'][1], j['left'][0], j['cy']+1.0,
      label='creates (on approval)', lbl_offset=(0, 0.35))
card(ax, jr['top'][0]-0.3, jr['top'][1]+0.2, '1')
card(ax, j['left'][0]-0.3, j['cy']+1.0, '1')

# notifications → profiles  (Many:1)
n = entities['notifications']
arrow(ax, n['right'][0], n['cy']+1.0, p['left'][0], p['cy']-1.5,
      label='sent to', lbl_offset=(0.1, 0.3))
card(ax, n['right'][0]+0.3, n['cy']+1.0, 'N')
card(ax, p['left'][0]-0.3, p['cy']-1.5, '1')

# subscriptions → profiles  (Many:1)
s = entities['subscriptions']
arrow(ax, s['top'][0], s['top'][1], p['bottom'][0]-0.3, p['bottom'][1],
      label='subscribed by', lbl_offset=(-0.5, 0))
card(ax, s['top'][0]-0.3, s['top'][1]+0.2, 'N')
card(ax, p['bottom'][0]-0.6, p['bottom'][1]-0.3, '1')

# subscriptions → jobs  (Many:1)
arrow(ax, s['right'][0], s['cy'], j['bottom'][0]+0.5, j['bottom'][1],
      label='subscribes to', lbl_offset=(0, -0.3))
card(ax, s['right'][0]+0.3, s['cy'], 'N')
card(ax, j['bottom'][0]+0.8, j['bottom'][1]-0.3, '1')

# documents → profiles  (Many:1)
d = entities['documents']
arrow(ax, d['right'][0], d['cy'], p['top'][0]-0.5, p['top'][1],
      label='owned by', lbl_offset=(0, 0.3))
card(ax, d['right'][0]+0.3, d['cy'], 'N')
card(ax, p['top'][0]-0.8, p['top'][1]+0.3, '1')

# profiles.savedJobs[] ↔ jobs  (Many:Many — dashed)
ax.annotate('', xy=(j['left'][0], j['cy']), xytext=(p['right'][0], p['cy']+1.5),
            arrowprops=dict(arrowstyle='<->', color='#7C3AED', lw=1.4,
                            linestyle='dashed', mutation_scale=14), zorder=5)
ax.text((p['right'][0]+j['left'][0])/2, (p['cy']+1.5+j['cy'])/2+0.3,
        'saves (M:N)\nprofiles.savedJobs[]', ha='center', va='center',
        fontsize=7.5, color='#7C3AED', style='italic',
        bbox=dict(facecolor='white', edgecolor='none', alpha=0.85, pad=1), zorder=6)
card(ax, p['right'][0]+0.3, p['cy']+1.5, 'M', color='#7C3AED')
card(ax, j['left'][0]-0.3, j['cy'], 'N', color='#7C3AED')

# categories — note (jobs use category as enum string, no hard FK)
cat = entities['categories']
ax.annotate('', xy=(j['top'][0]+0.3, j['top'][1]), xytext=(cat['bottom'][0], cat['bottom'][1]),
            arrowprops=dict(arrowstyle='->', color='#94A3B8', lw=1.2,
                            linestyle='dotted', mutation_scale=12), zorder=5)
ax.text((j['top'][0]+0.3+cat['bottom'][0])/2, (j['top'][1]+cat['bottom'][1])/2+0.2,
        'enum ref\n(no hard FK)',
        ha='center', va='center', fontsize=7, color='#94A3B8', style='italic',
        bbox=dict(facecolor='white', edgecolor='none', alpha=0.85, pad=1), zorder=6)

# ── LEGEND ────────────────────────────────────────────────────────────────────
lx, ly = 0.5, 0.3
ax.plot([lx, lx+0.5], [ly+0.4, ly+0.4], color=LINE_CLR, lw=1.4); ax.annotate('', xy=(lx+0.5, ly+0.4), xytext=(lx+0.4, ly+0.4), arrowprops=dict(arrowstyle='-|>', color=LINE_CLR, lw=1.4, mutation_scale=12))
ax.text(lx+0.6, ly+0.4, '= Reference / Relationship (solid)', fontsize=8, va='center', color=TEXT_CLR)
ax.plot([lx, lx+0.5], [ly+0.1, ly+0.1], color='#7C3AED', lw=1.4, linestyle='dashed')
ax.text(lx+0.6, ly+0.1, '= Many-to-Many (dashed)', fontsize=8, va='center', color='#7C3AED')
ax.plot([lx+4.5, lx+5.0], [ly+0.4, ly+0.4], color='#94A3B8', lw=1.2, linestyle='dotted')
ax.text(lx+5.1, ly+0.4, '= Enum reference (no hard FK)', fontsize=8, va='center', color='#94A3B8')
card(ax, lx+4.7, ly+0.1, '🔑 = Primary Key field', color=TEAL_HDR)

plt.tight_layout(pad=0.5)
out = r'c:\Users\RITHI\OneDrive\Desktop\Maldivess\er_diagram.png'
plt.savefig(out, dpi=180, bbox_inches='tight', facecolor='white')
print(f'✅ ER diagram saved: {out}')
