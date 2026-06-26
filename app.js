/* ==========================================================================
   ACADEMIC LOG PRO - COMPLETE TEACHER ERP & ATTENDANCE SUITE
   ========================================================================== */

// Global App State
let state = {
  subjects: [],
  logs: [],
  students: [],
  timetable: {},      // structure: { DayOfWeek: { Period: { subjectId, classroom } } }
  checkedTopics: {},  // structure: { subjectId: { "Unit:TopicName": true } }
  academicEvents: {}, // structure: { dateStr: { type, title, subjectId } }
  theme: 'dark-mode'
};

// Available Days & Periods
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// ==========================================================================
// MOCK DATA GENERATOR (For initial ERP load)
// ==========================================================================
const MOCK_SUBJECTS = [
  {
    id: "sub-1",
    name: "Digital Communication",
    code: "EC-601",
    department: "ECE",
    yearSemester: "Sem VI",
    section: "A",
    totalUnits: 5,
    totalWorkingDays: 90,
    syllabus: {
      1: ["Information Theory & Entropy", "Source Coding Theorem", "Huffman Coding Algorithm", "Shannon-Fano Coding"],
      2: ["Pulse Code Modulation", "Quantization Noise & Errors", "Delta Modulation", "Adaptive Delta Modulation"],
      3: ["Amplitude Shift Keying (ASK)", "Frequency Shift Keying (FSK)", "Phase Shift Keying (PSK)", "Quadrature Amplitude Modulation"]
    },
    unitNames: {
      1: "Information Theory",
      2: "Waveform Coding",
      3: "Digital Modulation"
    }
  },
  {
    id: "sub-2",
    name: "Microprocessors & Interfaces",
    code: "EE-602",
    department: "EEE",
    yearSemester: "Sem VI",
    section: "B",
    totalUnits: 5,
    totalWorkingDays: 85,
    syllabus: {
      1: ["8086 Internal Architecture", "Register Configuration", "Memory Segmentation", "Flag Register & Pins"],
      2: ["8086 Instruction Set", "Instruction Templates", "Addressing Modes", "Assembly Coding Examples"]
    },
    unitNames: {
      1: "Introduction to 8086",
      2: "8086 Programming"
    }
  },
  {
    id: "sub-3",
    name: "VLSI Design & Technology",
    code: "EC-803",
    department: "ECE",
    yearSemester: "Sem VIII",
    section: "A",
    totalUnits: 4,
    totalWorkingDays: 80,
    syllabus: {
      1: ["MOS Transistor Theory", "NMOS & CMOS Inverter Characteristics", "CMOS Fabrication Steps"],
      2: ["Combinational MOS Logic Circuits", "Sequential MOS Logic Design", "Dynamic CMOS Logic Families"]
    },
    unitNames: {
      1: "Introduction to VLSI",
      2: "MOS Logic Circuits"
    }
  }
];

const MOCK_STUDENTS = [
  // ECE - Sem VI - Sec A
  { id: "std-1", name: "Rahul Kumar", rollNumber: "22A31A0401", registerNumber: "REG-10101", department: "ECE", year: "3rd Year", semester: "Sem VI", section: "A", email: "rahul.k@example.com", phone: "9876540001" },
  { id: "std-2", name: "Priya Sharma", rollNumber: "22A31A0402", registerNumber: "REG-10102", department: "ECE", year: "3rd Year", semester: "Sem VI", section: "A", email: "priya.s@example.com", phone: "9876540002" },
  { id: "std-3", name: "Amit Patel", rollNumber: "22A31A0403", registerNumber: "REG-10103", department: "ECE", year: "3rd Year", semester: "Sem VI", section: "A", email: "amit.p@example.com", phone: "9876540003" },
  { id: "std-4", name: "Sneha Reddy", rollNumber: "22A31A0404", registerNumber: "REG-10104", department: "ECE", year: "3rd Year", semester: "Sem VI", section: "A", email: "sneha.r@example.com", phone: "9876540004" },
  { id: "std-5", name: "Vikram Singh", rollNumber: "22A31A0405", registerNumber: "REG-10105", department: "ECE", year: "3rd Year", semester: "Sem VI", section: "A", email: "vikram.s@example.com", phone: "9876540005" },
  
  // EEE - Sem VI - Sec B
  { id: "std-6", name: "Rohan Das", rollNumber: "22A31A0501", registerNumber: "REG-10201", department: "EEE", year: "3rd Year", semester: "Sem VI", section: "B", email: "rohan.d@example.com", phone: "9876540006" },
  { id: "std-7", name: "Neha Sen", rollNumber: "22A31A0502", registerNumber: "REG-10202", department: "EEE", year: "3rd Year", semester: "Sem VI", section: "B", email: "neha.s@example.com", phone: "9876540007" },
  
  // ECE - Sem VIII - Sec A
  { id: "std-8", name: "Karan Johar", rollNumber: "20A31A0401", registerNumber: "REG-10301", department: "ECE", year: "4th Year", semester: "Sem VIII", section: "A", email: "karan.j@example.com", phone: "9876540008" }
];

const MOCK_TIMETABLE = {
  "Monday": {
    1: { subjectId: "sub-1", classroom: "Room 302" },
    2: { subjectId: "sub-2", classroom: "Microprocessor Lab" },
    4: { subjectId: "sub-3", classroom: "Room 401" }
  },
  "Tuesday": {
    1: { subjectId: "sub-3", classroom: "Room 401" },
    3: { subjectId: "sub-1", classroom: "Room 302" },
    5: { subjectId: "sub-2", classroom: "Room 305" }
  },
  "Wednesday": {
    2: { subjectId: "sub-1", classroom: "Room 302" },
    4: { subjectId: "sub-2", classroom: "Room 305" },
    6: { subjectId: "sub-3", classroom: "Room 401" }
  },
  "Thursday": {
    1: { subjectId: "sub-2", classroom: "Room 305" },
    2: { subjectId: "sub-3", classroom: "Room 401" },
    7: { subjectId: "sub-1", classroom: "Room 302" }
  },
  "Friday": {
    3: { subjectId: "sub-1", classroom: "Room 302" },
    4: { subjectId: "sub-3", classroom: "Room 401" },
    5: { subjectId: "sub-2", classroom: "Microprocessor Lab" }
  },
  "Saturday": {
    1: { subjectId: "sub-1", classroom: "Room 302" },
    2: { subjectId: "sub-2", classroom: "Room 305" }
  }
};

const getPastDateStr = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

const getFutureDateStr = (daysAhead) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
};

const MOCK_LOGS = [
  {
    id: "log-1",
    subjectId: "sub-1",
    date: getPastDateStr(4),
    period: 1,
    topicTaught: "Information Theory & Entropy",
    unitNumber: 1,
    method: "Lecture",
    durationMinutes: 50,
    attendancePercent: 80,
    homework: "Calculate entropy for a binary symmetric channel",
    notes: "Detailed mathematical derivations completed.",
    nextTopic: "Source Coding Theorem",
    type: "Completed",
    attendance: { "std-1": "P", "std-2": "A", "std-3": "P", "std-4": "P", "std-5": "P" }
  },
  {
    id: "log-2",
    subjectId: "sub-2",
    date: getPastDateStr(4),
    period: 2,
    topicTaught: "8086 Internal Architecture",
    unitNumber: 1,
    method: "Lecture",
    durationMinutes: 50,
    attendancePercent: 100,
    homework: "Draw block diagram of BIU and EU modules",
    notes: "Introduced BIU and EU segments.",
    nextTopic: "Register Configuration",
    type: "Completed",
    attendance: { "std-6": "P", "std-7": "P" }
  },
  {
    id: "log-3",
    subjectId: "sub-3",
    date: getPastDateStr(3),
    period: 4,
    topicTaught: "MOS Transistor Theory",
    unitNumber: 1,
    method: "Lecture",
    durationMinutes: 50,
    attendancePercent: 100,
    homework: "Derive I-V equations of linear region",
    notes: "Basic structures of logic layouts discussed.",
    nextTopic: "NMOS & CMOS Inverter Characteristics",
    type: "Completed",
    attendance: { "std-8": "P" }
  },
  {
    id: "log-4",
    subjectId: "sub-1",
    date: getPastDateStr(2),
    period: 3,
    topicTaught: "Source Coding Theorem",
    unitNumber: 1,
    method: "PPT",
    durationMinutes: 50,
    attendancePercent: 60,
    homework: "Read page 45-52 of textbooks",
    notes: "Reviewed Shannon capacity constraints.",
    nextTopic: "Huffman Coding Algorithm",
    type: "Completed",
    attendance: { "std-1": "P", "std-2": "A", "std-3": "A", "std-4": "P", "std-5": "P" }
  },
  {
    id: "log-5",
    subjectId: "sub-2",
    date: getPastDateStr(1),
    period: 4,
    topicTaught: "Register Configuration",
    unitNumber: 1,
    method: "Discussion",
    durationMinutes: 50,
    attendancePercent: 50,
    homework: "List general purpose registers",
    notes: "Questions asked on index registers.",
    nextTopic: "Memory Segmentation",
    type: "Completed",
    attendance: { "std-6": "P", "std-7": "A" }
  }
];

const MOCK_CHECKED_TOPICS = {
  "sub-1": { "1:Information Theory & Entropy": true, "1:Source Coding Theorem": true },
  "sub-2": { "1:8086 Internal Architecture": true, "1:Register Configuration": true },
  "sub-3": { "1:MOS Transistor Theory": true }
};

// ==========================================================================
// STATE PERSISTENCE & INITIALIZATION
// ==========================================================================
function loadState() {
  const saved = localStorage.getItem('academic_log_pro_state');
  if (saved) {
    try {
      state = JSON.parse(saved);
      // Backwards compatibility for student array and checked items
      if (!state.students) state.students = [];
      if (!state.checkedTopics) state.checkedTopics = {};
      if (!state.academicEvents) state.academicEvents = {};
    } catch (e) {
      console.error('Error loading state, restoring defaults', e);
      loadMockData();
    }
  } else {
    loadMockData();
  }
}

function saveState() {
  localStorage.setItem('academic_log_pro_state', JSON.stringify(state));
}

function loadMockData() {
  state.subjects = [...MOCK_SUBJECTS];
  state.students = [...MOCK_STUDENTS];
  state.timetable = {...MOCK_TIMETABLE};
  state.logs = [...MOCK_LOGS];
  state.checkedTopics = {...MOCK_CHECKED_TOPICS};
  state.academicEvents = {
    [getFutureDateStr(2)]: { date: getFutureDateStr(2), type: 'Holiday', title: 'National Holiday' },
    [getFutureDateStr(5)]: { date: getFutureDateStr(5), type: 'Exam Day', title: 'Midterm Examination', subjectId: 'sub-1' },
    [getFutureDateStr(8)]: { date: getFutureDateStr(8), type: 'Lab Day', title: 'VLSI Design Review', subjectId: 'sub-3' },
    [getFutureDateStr(12)]: { date: getFutureDateStr(12), type: 'Special Event', title: 'College Hackathon' }
  };
  state.theme = 'dark-mode';
  saveState();
}

// Global Variables for Form Modals & Wizard
let activeSyllabusSubjectId = '';
let activeSubjectFormUnitTab = 1;
let activeSubjectSyllabusTemp = {}; 
let activeSubjectUnitNamesTemp = {};
let currentWizardStep = 1;
let tempAttendanceMap = {}; // stores { studentId: status } inside current wizard
let currentCalendarMonth = 0;
let currentCalendarYear = 2026;

// ==========================================================================
// APP INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initPWA();
  applyTheme();
  setupRouting();
  setupDOMListeners();
  setupWizardListeners();

  const today = new Date();
  currentCalendarMonth = today.getMonth();
  currentCalendarYear = today.getFullYear();

  navigate(getRouteFromHash() || 'dashboard');
});

// PWA service worker registration
function initPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => console.log('Service Worker registered.', reg))
        .catch((err) => console.log('Service Worker registration failed.', err));
    });
  }
}

// Theme Controls
function applyTheme() {
  const body = document.body;
  body.className = state.theme;
  
  const iconUseTags = document.querySelectorAll('#theme-toggle use, #header-theme-toggle use');
  iconUseTags.forEach(tag => {
    tag.setAttribute('href', state.theme === 'dark-mode' ? '#icon-sun' : '#icon-moon');
  });
}

function toggleTheme() {
  state.theme = state.theme === 'dark-mode' ? 'light-mode' : 'dark-mode';
  saveState();
  applyTheme();
  showToast(`Theme set to ${state.theme === 'dark-mode' ? 'Dark' : 'Light'} theme`);
}

// ==========================================================================
// ROUTER & NAVIGATION
// ==========================================================================
function setupRouting() {
  const navItems = document.querySelectorAll('.nav-item, .bottom-nav-item, .settings-link');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const route = item.getAttribute('data-route');
      window.location.hash = route;
      navigate(route);
    });
  });

  window.addEventListener('hashchange', () => {
    const route = getRouteFromHash();
    if (route) navigate(route);
  });
}

function getRouteFromHash() {
  return window.location.hash.replace('#', '');
}

function navigate(route) {
  // Direct matching to support custom profile navigation routes e.g. student-profile
  let actualRoute = route;
  if (route.startsWith('student-profile?id=')) {
    actualRoute = 'student-profile';
  }

  document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-route') === actualRoute) {
      item.classList.add('active');
    }
  });

  document.querySelectorAll('.app-view').forEach(view => {
    view.classList.remove('active');
  });

  const targetView = document.getElementById(`view-${actualRoute}`);
  if (targetView) {
    targetView.classList.add('active');
    
    // Header text
    let displayTitle = actualRoute.charAt(0).toUpperCase() + actualRoute.slice(1).replace('-', ' ');
    if (actualRoute === 'student-profile') displayTitle = "Student Profile";
    document.getElementById('page-title').textContent = displayTitle;

    // View render callbacks
    if (actualRoute === 'dashboard') renderDashboard();
    else if (actualRoute === 'subjects') renderSubjects();
    else if (actualRoute === 'timetable') renderTimetable();
    else if (actualRoute === 'logs') renderLogs();
    else if (actualRoute === 'students') renderStudents();
    else if (actualRoute === 'student-profile') {
      const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
      renderStudentProfile(urlParams.get('id'));
    }
    else if (actualRoute === 'calendar') renderCalendar();
    else if (actualRoute === 'progress') renderProgress();
    else if (actualRoute === 'analytics') renderAnalytics();
    else if (actualRoute === 'reports') renderReports();
    else if (actualRoute === 'search') renderSearch();
    else if (actualRoute === 'settings') renderSettings();
  }
}

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let iconId = '#icon-check';
  if (type === 'danger') iconId = '#icon-trash';
  if (type === 'warning') iconId = '#icon-alert';
  
  toast.innerHTML = `
    <svg class="btn-icon"><use href="${iconId}"></use></svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'all 0.4s var(--transition-ease)';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// ==========================================================================
// DOM LISTENERS SETUP
// ==========================================================================
function setupDOMListeners() {
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  document.getElementById('header-theme-toggle').addEventListener('click', toggleTheme);

  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(btn.getAttribute('data-close'));
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal.id);
    });
  });

  document.getElementById('global-fab').addEventListener('click', () => openLogModal());
  document.getElementById('timetable-cell-form').addEventListener('submit', handleTimetableAssignment);
  document.getElementById('btn-delete-timetable-cell').addEventListener('click', handleTimetableCellDelete);

  // Subject management events
  document.getElementById('add-subject-btn').addEventListener('click', () => openSubjectModal());
  document.getElementById('subject-form').addEventListener('submit', handleSubjectSubmit);
  document.getElementById('subj-units').addEventListener('change', (e) => {
    rebuildSyllabusUnitTabs(parseInt(e.target.value) || 1);
  });

  // Daily log select bindings
  document.getElementById('new-log-btn').addEventListener('click', () => openLogModal());
  document.getElementById('log-subject-select').addEventListener('change', (e) => {
    const subId = e.target.value;
    updateLogUnitDropdown(subId);
    autoSuggestLogTopicAndNext(subId);
  });
  document.getElementById('log-unit').addEventListener('change', (e) => {
    updateLogTopicDropdown(document.getElementById('log-subject-select').value, parseInt(e.target.value));
  });
  document.getElementById('log-topic-select').addEventListener('change', (e) => {
    const val = e.target.value;
    if (val) {
      document.getElementById('log-topic-taught').value = val;
      suggestNextTopicPlanned(document.getElementById('log-subject-select').value, parseInt(document.getElementById('log-unit').value), val);
    }
  });

  // Log lists filter actions
  document.getElementById('filter-log-subject').addEventListener('change', renderLogs);
  document.getElementById('filter-log-type').addEventListener('change', renderLogs);
  document.getElementById('filter-log-date').addEventListener('change', renderLogs);
  document.getElementById('clear-log-filters').addEventListener('click', () => {
    document.getElementById('filter-log-subject').value = '';
    document.getElementById('filter-log-type').value = '';
    document.getElementById('filter-log-date').value = '';
    renderLogs();
  });

  // Student management events
  document.getElementById('add-student-btn').addEventListener('click', () => openStudentModal());
  document.getElementById('student-form').addEventListener('submit', handleStudentSubmit);
  document.getElementById('import-students-btn').addEventListener('click', () => openModal('student-import-modal'));
  document.getElementById('student-import-form').addEventListener('submit', handleCSVImport);

  // Student list filter actions
  document.getElementById('filter-stud-dept').addEventListener('change', renderStudents);
  document.getElementById('filter-stud-sem').addEventListener('change', renderStudents);
  document.getElementById('filter-stud-sec').addEventListener('change', renderStudents);
  document.getElementById('filter-stud-search').addEventListener('input', renderStudents);

  // Calendar controls
  document.getElementById('prev-month-btn').addEventListener('click', () => changeCalendarMonth(-1));
  document.getElementById('next-month-btn').addEventListener('click', () => changeCalendarMonth(1));
  
  // Date selection actions (options modal)
  document.getElementById('btn-cal-add-log').addEventListener('click', () => {
    const dateStr = document.getElementById('cal-date-hidden').value;
    closeModal('calendar-date-modal');
    openLogModal({ date: dateStr });
  });

  document.getElementById('btn-cal-config-event').addEventListener('click', () => {
    const dateStr = document.getElementById('cal-date-hidden').value;
    openCalendarEventModal(dateStr);
  });

  // Calendar Event Configuration modal form & action triggers
  document.getElementById('calendar-event-form').addEventListener('submit', handleCalendarEventSubmit);
  document.getElementById('btn-delete-calendar-event').addEventListener('click', deleteCalendarEvent);
  document.getElementById('event-type-select').addEventListener('change', toggleEventSubjectField);

  // Daily log date change event trigger to check for events
  document.getElementById('log-date').addEventListener('change', checkLogDateForAcademicEvent);

  // Syllabus tracker subject switch
  document.getElementById('progress-subject-select').addEventListener('change', (e) => {
    activeSyllabusSubjectId = e.target.value;
    renderProgress();
  });

  // Reports dropdown switch & print
  document.getElementById('report-type-select').addEventListener('change', generateReportPreview);
  document.getElementById('report-subject').addEventListener('change', generateReportPreview);
  document.getElementById('report-month').addEventListener('change', generateReportPreview);
  document.getElementById('btn-export-csv').addEventListener('click', exportReportCSV);
  document.getElementById('btn-print-report').addEventListener('click', () => window.print());
  document.getElementById('btn-print-profile').addEventListener('click', () => window.print());

  // Global keyword search input
  document.getElementById('global-search-input').addEventListener('input', renderSearch);

  // Database backups actions
  document.getElementById('btn-backup-data').addEventListener('click', backupData);
  document.getElementById('btn-restore-trigger').addEventListener('click', () => {
    document.getElementById('restore-file-input').click();
  });
  document.getElementById('restore-file-input').addEventListener('change', restoreData);
  document.getElementById('btn-clear-all').addEventListener('click', clearAllData);
  document.getElementById('btn-theme-switch-light').addEventListener('click', () => {
    state.theme = 'light-mode'; saveState(); applyTheme(); showToast('Light mode set');
  });
  document.getElementById('btn-theme-switch-dark').addEventListener('click', () => {
    state.theme = 'dark-mode'; saveState(); applyTheme(); showToast('Dark mode set');
  });
}

function generateUUID() {
  return 'uuid-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
}

// ==========================================================================
// 1. DASHBOARD VIEW CONTROLLER
// ==========================================================================
function renderDashboard() {
  document.getElementById('dash-total-subjects').textContent = state.subjects.length;
  
  let totalClasses = 0;
  Object.values(state.timetable).forEach(d => totalClasses += Object.keys(d).length);
  document.getElementById('dash-total-classes').textContent = totalClasses;
  document.getElementById('dash-total-students').textContent = state.students.length;

  let totalTopics = 0;
  let completedTopics = 0;
  state.subjects.forEach(sub => {
    Object.values(sub.syllabus || {}).forEach(arr => totalTopics += arr.length);
    completedTopics += Object.keys(state.checkedTopics[sub.id] || {}).length;
  });
  const completionPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  document.getElementById('dash-syllabus-pct').textContent = `${completionPct}%`;

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayIndex = new Date().getDay();
  const currentDayName = daysOfWeek[todayIndex];
  document.getElementById('dash-current-day').textContent = `Today: ${currentDayName}`;

  const todayScheduleContainer = document.getElementById('dash-today-schedule');
  todayScheduleContainer.innerHTML = '';

  const todayTimetable = state.timetable[currentDayName] || {};
  const periodsToday = Object.keys(todayTimetable).sort((a,b) => a-b);

  if (periodsToday.length === 0) {
    todayScheduleContainer.innerHTML = `
      <div class="empty-state"><p>No lectures scheduled for today (${currentDayName}).</p></div>
    `;
  } else {
    periodsToday.forEach(periodNum => {
      const cellData = todayTimetable[periodNum];
      const subject = state.subjects.find(s => s.id === cellData.subjectId);
      
      if (subject) {
        const todayDateStr = new Date().toISOString().split('T')[0];
        const logRecorded = state.logs.find(l => l.date === todayDateStr && l.period == periodNum && l.subjectId === subject.id);
        
        const card = document.createElement('div');
        card.className = 'today-sched-card';
        card.innerHTML = `
          <span class="sched-period-badge">P${periodNum}</span>
          <div class="sched-details">
            <h4 class="sched-subject">${subject.name} (${subject.code})</h4>
            <p class="sched-classroom">${cellData.classroom || 'General Room'}</p>
          </div>
          <div class="sched-actions">
            ${logRecorded 
              ? `<span class="status-indicator-pill online" style="background:rgba(48,209,88,0.1);"><span class="dot"></span> Recorded</span>`
              : `<button class="glass-btn primary" onclick="quickLogFromTimetable('${currentDayName}', ${periodNum})">Log & Att.</button>`
            }
          </div>
        `;
        todayScheduleContainer.appendChild(card);
      }
    });
  }

  // Alerts & insights (lagging subjects & shortage warning list)
  const alertsContainer = document.getElementById('dash-alerts');
  alertsContainer.innerHTML = '';
  let alertsCount = 0;

  // Shortage risks warning: find students with less than 75% overall attendance
  const shortageStudents = state.students.filter(std => {
    const metrics = getStudentAttendanceMetrics(std.id);
    return metrics.totalClasses > 0 && metrics.overallPercent < 75;
  });

  if (shortageStudents.length > 0) {
    alertsCount++;
    const alert = document.createElement('div');
    alert.className = 'alert-item danger';
    alert.innerHTML = `
      <div class="alert-icon color-danger"><svg class="btn-icon"><use href="#icon-alert"></use></svg></div>
      <div class="alert-content">
        <h4>Shortage Warning</h4>
        <p>There are <strong>${shortageStudents.length} student(s)</strong> with overall attendance below the 75% requirement. Check analytics dashboard for details.</p>
        <button class="glass-btn secondary" style="margin-top: 8px; font-size:11px; padding:6px 12px;" onclick="navigate('analytics')">View Risks</button>
      </div>
    `;
    alertsContainer.appendChild(alert);
  }

  state.subjects.forEach(sub => {
    let subTopics = 0;
    Object.values(sub.syllabus || {}).forEach(arr => subTopics += arr.length);
    const subChecked = Object.keys(state.checkedTopics[sub.id] || {}).length;
    const subPct = subTopics > 0 ? (subChecked / subTopics) * 100 : 0;
    
    if (subTopics > 0 && subPct < 20) {
      alertsCount++;
      const alert = document.createElement('div');
      alert.className = 'alert-item warning';
      alert.innerHTML = `
        <div class="alert-icon color-orange"><svg class="btn-icon"><use href="#icon-alert"></use></svg></div>
        <div class="alert-content">
          <h4>Syllabus Alert: ${sub.name}</h4>
          <p>Syllabus coverage is lagging at <strong>${Math.round(subPct)}%</strong>. Click tracker to map units.</p>
        </div>
      `;
      alertsContainer.appendChild(alert);
    }
  });

  if (alertsCount === 0) {
    alertsContainer.innerHTML = `
      <div class="alert-item info glass-card">
        <div class="alert-icon color-blue"><svg class="btn-icon"><use href="#icon-check"></use></svg></div>
        <div class="alert-content">
          <h4>All systems operational</h4>
          <p>Syllabus milestones achieved, attendance rosters look healthy.</p>
        </div>
      </div>
    `;
  }

  // Populate upcoming academic events
  const upcomingContainer = document.getElementById('dash-upcoming-events');
  if (upcomingContainer) {
    upcomingContainer.innerHTML = '';
    
    const todayStr = new Date().toISOString().split('T')[0];
    
    const upcomingEvents = Object.values(state.academicEvents)
      .filter(ev => ev.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (upcomingEvents.length === 0) {
      upcomingContainer.innerHTML = `
        <div style="text-align: center; padding: 16px; opacity: 0.6; font-style: italic; font-size: 13px;">
          No upcoming academic events scheduled.
        </div>
      `;
    } else {
      upcomingEvents.forEach(ev => {
        const item = document.createElement('div');
        item.className = 'upcoming-event-item';
        item.style.cursor = 'pointer';
        
        const dateObj = new Date(ev.date + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        const sub = ev.subjectId ? state.subjects.find(s => s.id === ev.subjectId) : null;
        const subText = sub ? `${sub.code} - ${sub.name}` : 'All Classes';
        
        const clsSuffix = eventTypeClasses[ev.type] || 'special-event';
        
        item.innerHTML = `
          <div class="upcoming-event-meta" style="margin-bottom: 4px;">
            <span class="calendar-event-label ${clsSuffix}" style="margin-top:0; font-size:9px; padding:2px 6px; display:inline-block; width:auto; border-radius:4px;">${ev.type}</span>
            <span style="font-size: 11px; opacity: 0.7;">${formattedDate}</span>
          </div>
          <div class="upcoming-event-title" style="font-weight: 600; font-size: 13px;">${ev.title}</div>
          <div style="font-size: 11px; opacity: 0.8; color: var(--text-muted); margin-top: 2px;">${subText}</div>
        `;
        
        item.addEventListener('click', () => {
          navigate('calendar');
          window.location.hash = 'calendar';
          
          const evDate = new Date(ev.date + 'T00:00:00');
          currentCalendarMonth = evDate.getMonth();
          currentCalendarYear = evDate.getFullYear();
          renderCalendar();
          
          setTimeout(() => {
            openCalendarDateModal(ev.date);
          }, 150);
        });
        
        upcomingContainer.appendChild(item);
      });
    }
  }
}

function quickLogFromTimetable(day, period) {
  const config = state.timetable[day]?.[period];
  if (config) {
    openLogModal({
      subjectId: config.subjectId,
      period: period,
      date: new Date().toISOString().split('T')[0]
    });
  }
}

// ==========================================================================
// 2. SUBJECT MANAGEMENT
// ==========================================================================
function renderSubjects() {
  const list = document.getElementById('subjects-list');
  list.innerHTML = '';

  if (state.subjects.length === 0) {
    list.innerHTML = `
      <div class="empty-state glass-panel" style="grid-column: 1 / -1;">
        <p>No subjects added yet.</p>
        <button class="glass-btn primary" onclick="openSubjectModal()">Add Subject</button>
      </div>
    `;
    return;
  }

  state.subjects.forEach(sub => {
    let totalTopics = 0;
    Object.values(sub.syllabus || {}).forEach(arr => totalTopics += arr.length);
    const checkedMap = state.checkedTopics[sub.id] || {};
    const checkedCount = Object.keys(checkedMap).length;
    const progressPct = totalTopics > 0 ? Math.round((checkedCount / totalTopics) * 100) : 0;

    const card = document.createElement('div');
    card.className = 'subject-card glass-card';
    card.innerHTML = `
      <div class="subj-card-header">
        <div class="subj-card-title">
          <h4>${sub.name}</h4>
          <span>Code: ${sub.code}</span>
        </div>
        <div class="subj-card-actions">
          <button class="mini-icon-btn" onclick="openSubjectModal('${sub.id}')" title="Edit Subject">
            <svg class="btn-icon"><use href="#icon-edit"></use></svg>
          </button>
          <button class="mini-icon-btn delete" onclick="deleteSubject('${sub.id}')" title="Delete Subject">
            <svg class="btn-icon"><use href="#icon-trash"></use></svg>
          </button>
        </div>
      </div>
      <div class="subj-card-meta">
        <div class="meta-item">Dept: <strong>${sub.department}</strong></div>
        <div class="meta-item">Sem: <strong>${sub.yearSemester}</strong></div>
        <div class="meta-item">Sec: <strong>${sub.section || 'N/A'}</strong></div>
        <div class="meta-item">Units: <strong>${sub.totalUnits}</strong></div>
      </div>
      <div class="subj-card-progress">
        <div class="progress-label-row">
          <span>Syllabus Progress</span>
          <span>${progressPct}% (${checkedCount}/${totalTopics})</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width: ${progressPct}%"></div>
        </div>
      </div>
      ${sub.books ? `
      <div class="subj-card-books" style="margin-top: 10px; margin-bottom: 6px; padding-top: 8px; border-top: 1px dashed var(--glass-border); font-size: 12px; color: var(--text-muted); text-align: left;">
        <strong>References:</strong> <span style="white-space: pre-line;">${sub.books}</span>
      </div>
      ` : ''}
      <button class="glass-btn secondary" style="width: 100%; margin-top: 4px;" onclick="viewSubjectProgress('${sub.id}')">
        View Tracker
      </button>
    `;
    list.appendChild(card);
  });
}

function viewSubjectProgress(subId) {
  activeSyllabusSubjectId = subId;
  window.location.hash = 'progress';
  navigate('progress');
}

function rebuildSyllabusUnitTabs(unitsCount) {
  const tabsContainer = document.getElementById('syllabus-unit-tabs');
  tabsContainer.innerHTML = '';
  activeSubjectFormUnitTab = 1;

  for (let u = 1; u <= unitsCount; u++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `unit-tab-btn ${u === 1 ? 'active' : ''}`;
    btn.textContent = `Unit ${u}`;
    btn.addEventListener('click', () => {
      saveSyllabusTabContentToTemp();
      document.querySelectorAll('.unit-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSubjectFormUnitTab = u;
      document.getElementById('unit-topics-textarea').value = (activeSubjectSyllabusTemp[u] || []).join(',\n');
      document.getElementById('unit-name-input').value = activeSubjectUnitNamesTemp[u] || '';
    });
    tabsContainer.appendChild(btn);
  }
  document.getElementById('unit-topics-textarea').value = (activeSubjectSyllabusTemp[1] || []).join(',\n');
  document.getElementById('unit-name-input').value = activeSubjectUnitNamesTemp[1] || '';
}

function saveSyllabusTabContentToTemp() {
  if (document.getElementById('unit-name-input')) {
    activeSubjectUnitNamesTemp[activeSubjectFormUnitTab] = document.getElementById('unit-name-input').value.trim();
  }
  const txt = document.getElementById('unit-topics-textarea').value;
  activeSubjectSyllabusTemp[activeSubjectFormUnitTab] = txt.split(',')
    .map(part => part.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(part => part.length > 0);
}

function openSubjectModal(subjectId = '') {
  const form = document.getElementById('subject-form');
  form.reset();
  activeSubjectSyllabusTemp = {};
  activeSubjectUnitNamesTemp = {};
  
  if (subjectId) {
    document.getElementById('subject-modal-title').textContent = 'Edit Subject';
    const sub = state.subjects.find(s => s.id === subjectId);
    if (sub) {
      document.getElementById('subj-edit-id').value = sub.id;
      document.getElementById('subj-name').value = sub.name;
      document.getElementById('subj-code').value = sub.code;
      document.getElementById('subj-dept').value = sub.department;
      document.getElementById('subj-semester').value = sub.yearSemester;
      document.getElementById('subj-section').value = sub.section || '';
      document.getElementById('subj-units').value = sub.totalUnits;
      document.getElementById('subj-days').value = sub.totalWorkingDays;
      document.getElementById('subj-books').value = sub.books || '';
      
      for (let u = 1; u <= sub.totalUnits; u++) {
        activeSubjectSyllabusTemp[u] = [...(sub.syllabus[u] || [])];
        activeSubjectUnitNamesTemp[u] = (sub.unitNames || {})[u] || '';
      }
      rebuildSyllabusUnitTabs(sub.totalUnits);
    }
  } else {
    document.getElementById('subject-modal-title').textContent = 'Add New Subject';
    document.getElementById('subj-edit-id').value = '';
    document.getElementById('subj-books').value = '';
    for (let u = 1; u <= 5; u++) {
      activeSubjectSyllabusTemp[u] = [];
      activeSubjectUnitNamesTemp[u] = '';
    }
    rebuildSyllabusUnitTabs(5);
  }
  openModal('subject-modal');
}

function handleSubjectSubmit(e) {
  e.preventDefault();
  saveSyllabusTabContentToTemp();

  const editId = document.getElementById('subj-edit-id').value;
  const name = document.getElementById('subj-name').value;
  const code = document.getElementById('subj-code').value;
  const dept = document.getElementById('subj-dept').value;
  const sem = document.getElementById('subj-semester').value;
  const sec = document.getElementById('subj-section').value;
  const units = parseInt(document.getElementById('subj-units').value) || 1;
  const workingDays = parseInt(document.getElementById('subj-days').value) || 90;
  const books = document.getElementById('subj-books').value.trim();

  const cleanSyllabus = {};
  const cleanUnitNames = {};
  for (let u = 1; u <= units; u++) {
    cleanSyllabus[u] = activeSubjectSyllabusTemp[u] || [];
    cleanUnitNames[u] = activeSubjectUnitNamesTemp[u] || '';
  }

  if (editId) {
    const subIdx = state.subjects.findIndex(s => s.id === editId);
    if (subIdx !== -1) {
      state.subjects[subIdx] = {
        ...state.subjects[subIdx], name, code, department: dept, yearSemester: sem, section: sec, totalUnits: units, totalWorkingDays: workingDays,
        syllabus: cleanSyllabus,
        unitNames: cleanUnitNames,
        books: books
      };
      showToast('Subject updated successfully');
    }
  } else {
    state.subjects.push({
      id: generateUUID(), name, code, department: dept, yearSemester: sem, section: sec, totalUnits: units, totalWorkingDays: workingDays,
      syllabus: cleanSyllabus,
      unitNames: cleanUnitNames,
      books: books
    });
    showToast('New subject added');
  }

  saveState();
  closeModal('subject-modal');
  renderSubjects();
}

function deleteSubject(subId) {
  if (confirm('Are you sure you want to delete this subject? Timetable, logs and checked topics will be cleared.')) {
    state.subjects = state.subjects.filter(s => s.id !== subId);
    Object.keys(state.timetable).forEach(d => {
      Object.keys(state.timetable[d]).forEach(p => {
        if (state.timetable[d][p].subjectId === subId) delete state.timetable[d][p];
      });
    });
    state.logs = state.logs.filter(l => l.subjectId !== subId);
    delete state.checkedTopics[subId];
    saveState();
    renderSubjects();
    showToast('Subject deleted', 'danger');
  }
}

// ==========================================================================
// 3. TIMETABLE CONTROLLER
// ==========================================================================
function renderTimetable() {
  const tbody = document.getElementById('timetable-body');
  tbody.innerHTML = '';

  DAYS.forEach(day => {
    const row = document.createElement('tr');
    const dayCell = document.createElement('td');
    dayCell.textContent = day;
    row.appendChild(dayCell);

    PERIODS.forEach(periodNum => {
      const cell = document.createElement('td');
      cell.className = 'timetable-cell';
      const allocation = state.timetable[day]?.[periodNum];
      
      if (allocation) {
        const subject = state.subjects.find(s => s.id === allocation.subjectId);
        if (subject) {
          cell.className += ' allocated';
          cell.innerHTML = `
            <span class="tt-cell-subject">${subject.code}</span>
            <span class="tt-cell-room">${allocation.classroom || 'Room -'}</span>
            <div class="tt-cell-action">
              <button class="tt-mini-btn log-direct" onclick="quickLogFromTimetable('${day}', ${periodNum})" title="Log today">
                <svg class="btn-icon" style="width:10px; height:10px;"><use href="#icon-check"></use></svg>
              </button>
              <button class="tt-mini-btn" onclick="openTimetableCellModal('${day}', ${periodNum})" title="Edit">
                <svg class="btn-icon" style="width:10px; height:10px;"><use href="#icon-edit"></use></svg>
              </button>
              <button class="tt-mini-btn delete" onclick="clearTimetableSlot('${day}', ${periodNum})" title="Clear Slot" style="background:var(--color-danger); color:white;">
                <svg class="btn-icon" style="width:10px; height:10px;"><use href="#icon-trash"></use></svg>
              </button>
            </div>
          `;
          cell.addEventListener('click', (e) => {
            if (e.target.closest('.tt-mini-btn')) return;
            openTimetableCellModal(day, periodNum);
          });
        } else {
          cell.innerHTML = `<span class="time-sub">+ Add</span>`;
          cell.addEventListener('click', () => openTimetableCellModal(day, periodNum));
        }
      } else {
        cell.innerHTML = `<span class="time-sub">+ Add</span>`;
        cell.addEventListener('click', () => openTimetableCellModal(day, periodNum));
      }
      row.appendChild(cell);
    });
    tbody.appendChild(row);
  });
}

function clearTimetableSlot(day, period) {
  if (confirm(`Are you sure you want to clear Period ${period} on ${day}?`)) {
    if (state.timetable[day]) {
      delete state.timetable[day][period];
      saveState();
      renderTimetable();
      showToast(`Period ${period} on ${day} cleared.`);
    }
  }
}

function openTimetableCellModal(day, period) {
  document.getElementById('tt-day').value = day;
  document.getElementById('tt-period').value = period;

  const subSelect = document.getElementById('tt-subject');
  subSelect.innerHTML = '<option value="">Unassigned (Free Period)</option>';
  state.subjects.forEach(sub => {
    subSelect.innerHTML += `<option value="${sub.id}">${sub.name} (${sub.code})</option>`;
  });

  const existing = state.timetable[day]?.[period];
  const deleteBtn = document.getElementById('btn-delete-timetable-cell');
  if (existing) {
    subSelect.value = existing.subjectId;
    document.getElementById('tt-classroom').value = existing.classroom || '';
    if (deleteBtn) deleteBtn.style.display = 'inline-flex';
  } else {
    document.getElementById('tt-classroom').value = '';
    if (deleteBtn) deleteBtn.style.display = 'none';
  }
  openModal('timetable-modal');
}

function handleTimetableAssignment(e) {
  e.preventDefault();
  const day = document.getElementById('tt-day').value;
  const period = parseInt(document.getElementById('tt-period').value);
  const subjectId = document.getElementById('tt-subject').value;
  const classroom = document.getElementById('tt-classroom').value;

  if (!state.timetable[day]) state.timetable[day] = {};

  if (subjectId === '') {
    delete state.timetable[day][period];
    showToast(`Period ${period} on ${day} cleared.`);
  } else {
    state.timetable[day][period] = { subjectId, classroom };
    showToast(`Period ${period} on ${day} configured.`);
  }
  saveState();
  closeModal('timetable-modal');
  renderTimetable();
}

function handleTimetableCellDelete() {
  const day = document.getElementById('tt-day').value;
  const period = parseInt(document.getElementById('tt-period').value);
  if (state.timetable[day] && state.timetable[day][period]) {
    delete state.timetable[day][period];
    showToast(`Period ${period} on ${day} cleared.`);
    saveState();
    closeModal('timetable-modal');
    renderTimetable();
  }
}

// ==========================================================================
// 4. DAILY ACADEMIC LOG & MULTI-STEP ATTENDANCE WIZARD
// ==========================================================================
function setupWizardListeners() {
  document.getElementById('btn-wizard-next').addEventListener('click', handleWizardNext);
  document.getElementById('btn-wizard-back').addEventListener('click', handleWizardBack);
  
  // Quick Mark All Actions
  document.getElementById('btn-mark-all-present').addEventListener('click', () => markAllAttendance('P'));
  document.getElementById('btn-mark-all-absent').addEventListener('click', () => markAllAttendance('A'));
  
  // Real time search in Step 2 student roster
  document.getElementById('attendance-student-search').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('#attendance-students-table-body tr').forEach(row => {
      const name = row.cells[1].textContent.toLowerCase();
      const roll = row.cells[0].textContent.toLowerCase();
      row.style.display = (name.includes(term) || roll.includes(term)) ? '' : 'none';
    });
  });
}

function showWizardStep(step) {
  currentWizardStep = step;
  document.querySelectorAll('.wizard-page').forEach(page => page.classList.remove('active'));
  document.getElementById(`log-wizard-step-${step}`).classList.add('active');

  // Sync indicators
  for (let i = 1; i <= 3; i++) {
    const ind = document.getElementById(`indicator-step-${i}`);
    const line = document.getElementById(`indicator-step-${i === 3 ? 3 : i}-line`);
    
    ind.classList.remove('active', 'completed');
    if (line) line.classList.remove('active');

    if (i < step) {
      ind.classList.add('completed');
      if (line) line.classList.add('active');
    } else if (i === step) {
      ind.classList.add('active');
    }
  }

  // Toggle footer controls
  document.getElementById('btn-wizard-back').style.display = step === 1 ? 'none' : 'inline-flex';
  document.getElementById('btn-wizard-next').style.display = step === 3 ? 'none' : 'inline-flex';
  document.getElementById('btn-wizard-submit').style.display = step === 3 ? 'inline-flex' : 'none';
}

function handleWizardNext() {
  if (currentWizardStep === 1) {
    // Validate Step 1 forms inputs
    const sub = document.getElementById('log-subject-select').value;
    const type = document.getElementById('log-type').value;
    const date = document.getElementById('log-date').value;
    const topic = document.getElementById('log-topic-taught').value;

    if (!sub || !type || !date || (!topic && !['Holiday', 'Exam Day'].includes(type))) {
      showToast('Please fill out all required log details.', 'warning');
      return;
    }

    // Skip attendance step for Holiday/Exam log types
    if (['Holiday', 'Exam Day'].includes(type)) {
      tempAttendanceMap = {};
      populateSummaryStep();
      showWizardStep(3);
    } else {
      buildAttendanceRoster();
      showWizardStep(2);
    }
  } else if (currentWizardStep === 2) {
    populateSummaryStep();
    showWizardStep(3);
  }
}

function handleWizardBack() {
  if (currentWizardStep === 3) {
    const type = document.getElementById('log-type').value;
    if (['Holiday', 'Exam Day'].includes(type)) {
      showWizardStep(1);
    } else {
      showWizardStep(2);
    }
  } else if (currentWizardStep === 2) {
    showWizardStep(1);
  }
}

function buildAttendanceRoster() {
  const subId = document.getElementById('log-subject-select').value;
  const subject = state.subjects.find(s => s.id === subId);
  const tbody = document.getElementById('attendance-students-table-body');
  tbody.innerHTML = '';

  if (!subject) return;

  // Filter students mapping to the subject's department, sem, section
  const matchingStudents = state.students.filter(s => 
    s.department.toLowerCase() === subject.department.toLowerCase() &&
    s.semester.toLowerCase() === subject.yearSemester.toLowerCase() &&
    (!subject.section || s.section.toLowerCase() === subject.section.toLowerCase())
  );

  if (matchingStudents.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="empty-state" style="text-align:center;">
          No students registered in ${subject.department} - ${subject.yearSemester} - Section ${subject.section}.
          <br><button type="button" class="glass-btn secondary" style="margin-top:8px; font-size:11px;" onclick="closeModal('log-modal'); navigate('students');">Add Students</button>
        </td>
      </tr>
    `;
    return;
  }

  // Pre-load current edits or set default 'P'
  const logEditId = document.getElementById('log-edit-id').value;
  let activeLogAtt = {};
  if (logEditId) {
    const logObj = state.logs.find(l => l.id === logEditId);
    if (logObj && logObj.attendance) activeLogAtt = logObj.attendance;
  }

  matchingStudents.forEach(std => {
    // If not set yet in temp session, inherit or default
    if (!tempAttendanceMap[std.id]) {
      tempAttendanceMap[std.id] = activeLogAtt[std.id] || 'P';
    }

    const currentStatus = tempAttendanceMap[std.id];

    const row = document.createElement('tr');
    row.id = `att-row-${std.id}`;
    row.innerHTML = `
      <td><strong>${std.rollNumber}</strong></td>
      <td>${std.name}</td>
      <td>
        <div class="attendance-toggle-group">
          <button type="button" class="attendance-toggle-btn btn-p ${currentStatus === 'P' ? 'active' : ''}" onclick="toggleStudentAtt('${std.id}', 'P')">P</button>
          <button type="button" class="attendance-toggle-btn btn-a ${currentStatus === 'A' ? 'active' : ''}" onclick="toggleStudentAtt('${std.id}', 'A')">A</button>
          <button type="button" class="attendance-toggle-btn btn-l ${currentStatus === 'L' ? 'active' : ''}" onclick="toggleStudentAtt('${std.id}', 'L')">L</button>
          <button type="button" class="attendance-toggle-btn btn-m ${currentStatus === 'M' ? 'active' : ''}" onclick="toggleStudentAtt('${std.id}', 'M')">M</button>
          <button type="button" class="attendance-toggle-btn btn-pr ${currentStatus === 'PR' ? 'active' : ''}" onclick="toggleStudentAtt('${std.id}', 'PR')">PR</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function toggleStudentAtt(studentId, status) {
  tempAttendanceMap[studentId] = status;
  // Update UI classes inside row
  const row = document.getElementById(`att-row-${studentId}`);
  if (row) {
    row.querySelectorAll('.attendance-toggle-btn').forEach(btn => btn.classList.remove('active'));
    const btn = row.querySelector(`.btn-${status.toLowerCase()}`);
    if (btn) btn.classList.add('active');
  }
}

function markAllAttendance(status) {
  Object.keys(tempAttendanceMap).forEach(stdId => {
    toggleStudentAtt(stdId, status);
  });
  showToast(`Marked all matching students as ${status}`);
}

function populateSummaryStep() {
  const subId = document.getElementById('log-subject-select').value;
  const subject = state.subjects.find(s => s.id === subId);
  const type = document.getElementById('log-type').value;

  document.getElementById('sum-subj').textContent = subject ? `${subject.name} (${subject.code})` : '-';
  document.getElementById('sum-date').textContent = document.getElementById('log-date').value;
  document.getElementById('sum-period').textContent = 'Period ' + document.getElementById('log-period').value;
  document.getElementById('sum-topic').textContent = ['Holiday', 'Exam Day'].includes(type) ? `(${type})` : document.getElementById('log-topic-taught').value;

  const total = Object.keys(tempAttendanceMap).length;
  let present = 0;
  let absent = 0;

  Object.values(tempAttendanceMap).forEach(v => {
    if (['P', 'L', 'PR'].includes(v)) present++;
    if (v === 'A') absent++;
  });

  const pct = total > 0 ? Math.round((present / total) * 100) : 0;

  document.getElementById('sum-total-students').textContent = total;
  document.getElementById('sum-present').textContent = present;
  document.getElementById('sum-absent').textContent = absent;
  document.getElementById('sum-percent').textContent = `${pct}%`;
}

function renderLogs() {
  const filterSub = document.getElementById('filter-log-subject');
  const selectedVal = filterSub.value;
  filterSub.innerHTML = '<option value="">All Subjects</option>';
  state.subjects.forEach(sub => {
    filterSub.innerHTML += `<option value="${sub.id}">${sub.name}</option>`;
  });
  filterSub.value = selectedVal;

  const timeline = document.getElementById('logs-timeline');
  timeline.innerHTML = '';

  const filterSubjectId = document.getElementById('filter-log-subject').value;
  const filterType = document.getElementById('filter-log-type').value;
  const filterDate = document.getElementById('filter-log-date').value;

  const filtered = state.logs.filter(log => {
    if (filterSubjectId && log.subjectId !== filterSubjectId) return false;
    if (filterType && log.type !== filterType) return false;
    if (filterDate && log.date !== filterDate) return false;
    return true;
  });

  filtered.sort((a, b) => b.date.localeCompare(a.date) || b.period - a.period);

  if (filtered.length === 0) {
    timeline.innerHTML = '<div class="empty-state glass-card"><p>No log records match filters.</p></div>';
    return;
  }

  filtered.forEach(log => {
    const subject = state.subjects.find(s => s.id === log.subjectId);
    const subName = subject ? `${subject.name} (${subject.code})` : 'Deleted Subject';

    const item = document.createElement('div');
    item.className = `timeline-item ${log.type.toLowerCase().replace(' ', '-')}`;
    
    // Calculate P vs A counts
    let presentCount = 0;
    let totalCount = 0;
    if (log.attendance) {
      Object.values(log.attendance).forEach(status => {
        totalCount++;
        if (['P', 'L', 'PR'].includes(status)) presentCount++;
      });
    }

    const computedPercent = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : log.attendancePercent || 0;

    item.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="log-card glass-card">
        <div class="log-card-header">
          <div class="log-card-meta">
            <span class="log-date-label">${formatFriendlyDate(log.date)}</span>
            <span class="log-period-pill">Period ${log.period}</span>
            <span class="log-type-tag ${log.type.toLowerCase().replace(' ', '-')}">${log.type}</span>
          </div>
          <div class="subj-card-actions">
            <button class="mini-icon-btn" onclick="openLogModal({editLogId: '${log.id}'})" title="Edit Log">
              <svg class="btn-icon"><use href="#icon-edit"></use></svg>
            </button>
            <button class="mini-icon-btn delete" onclick="deleteLog('${log.id}')" title="Delete Log">
              <svg class="btn-icon"><use href="#icon-trash"></use></svg>
            </button>
          </div>
        </div>
        <div class="log-card-body">
          <div class="log-subject-name">${subName}</div>
          ${log.topicTaught ? `
            <div class="log-topic-row">
              <h4 class="topic-title">${log.topicTaught}</h4>
              <span class="topic-unit">Unit ${log.unitNumber || '-'}</span>
            </div>
          ` : ''}
          
          <div class="log-details-grid">
            <div class="detail-block">
              <span>Method</span>
              <strong>${log.method || '-'}</strong>
            </div>
            <div class="detail-block">
              <span>Duration</span>
              <strong>${log.durationMinutes} mins</strong>
            </div>
            <div class="detail-block">
              <span>Attendance Rate</span>
              <strong style="color:${computedPercent < 75 ? 'var(--color-danger)' : 'var(--color-success)'}">${computedPercent}% ${totalCount > 0 ? `(${presentCount}/${totalCount})` : ''}</strong>
            </div>
            ${log.nextTopic ? `
              <div class="detail-block" style="grid-column: span 2;">
                <span>Next Planned Topic</span>
                <strong>${log.nextTopic}</strong>
              </div>
            ` : ''}
          </div>

          ${log.homework ? `<div class="log-notes-text" style="border-color:var(--color-warning);"><strong>Homework:</strong> ${log.homework}</div>` : ''}
          ${log.notes ? `<div class="log-notes-text"><strong>Notes:</strong> ${log.notes}</div>` : ''}
        </div>
      </div>
    `;
    timeline.appendChild(item);
  });
}

function updateLogUnitDropdown(subId, selectedUnit = null) {
  const unitSelect = document.getElementById('log-unit');
  unitSelect.innerHTML = '';
  const subject = state.subjects.find(s => s.id === subId);
  if (!subject) return;

  for (let u = 1; u <= subject.totalUnits; u++) {
    const unitName = (subject.unitNames || {})[u] || '';
    const label = unitName ? `Unit ${u} - ${unitName}` : `Unit ${u}`;
    unitSelect.innerHTML += `<option value="${u}">${label}</option>`;
  }
  if (selectedUnit) unitSelect.value = selectedUnit;
}

function updateLogTopicDropdown(subId, unitNum, selectedTopic = '') {
  const topicSelect = document.getElementById('log-topic-select');
  topicSelect.innerHTML = '<option value="">Custom Topic (Write below)</option>';
  const subject = state.subjects.find(s => s.id === subId);
  if (!subject) return;

  const topics = (subject.syllabus || {})[unitNum] || [];
  topics.forEach(t => topicSelect.innerHTML += `<option value="${t}">${t}</option>`);
  topicSelect.value = (selectedTopic && topics.includes(selectedTopic)) ? selectedTopic : '';
}

function autoSuggestLogTopicAndNext(subId) {
  const subject = state.subjects.find(s => s.id === subId);
  if (!subject) return;

  let suggestedUnit = 1;
  let suggestedTopic = '';
  let found = false;

  for (let u = 1; u <= subject.totalUnits; u++) {
    const topics = (subject.syllabus || {})[u] || [];
    for (let t = 0; t < topics.length; t++) {
      const topicName = topics[t];
      const key = `${u}:${topicName}`;
      if (!(state.checkedTopics[subId] || {})[key]) {
        suggestedUnit = u;
        suggestedTopic = topicName;
        found = true; break;
      }
    }
    if (found) break;
  }

  updateLogUnitDropdown(subId, suggestedUnit);
  updateLogTopicDropdown(subId, suggestedUnit, suggestedTopic);
  
  if (suggestedTopic) {
    document.getElementById('log-topic-taught').value = suggestedTopic;
    suggestNextTopicPlanned(subId, suggestedUnit, suggestedTopic);
  } else {
    document.getElementById('log-topic-taught').value = '';
    document.getElementById('log-next-topic').value = '';
  }
}

function suggestNextTopicPlanned(subId, unitNum, currentTopic) {
  const subject = state.subjects.find(s => s.id === subId);
  if (!subject) return;

  const topics = (subject.syllabus || {})[unitNum] || [];
  const idx = topics.indexOf(currentTopic);

  if (idx !== -1 && idx + 1 < topics.length) {
    document.getElementById('log-next-topic').value = topics[idx + 1];
  } else if (unitNum + 1 <= subject.totalUnits) {
    const nextUnitTopics = (subject.syllabus || {})[unitNum + 1] || [];
    document.getElementById('log-next-topic').value = nextUnitTopics[0] || '';
  } else {
    document.getElementById('log-next-topic').value = '';
  }
}

function openLogModal(options = {}) {
  const form = document.getElementById('log-form');
  form.reset();
  tempAttendanceMap = {};

  const subSelect = document.getElementById('log-subject-select');
  subSelect.innerHTML = '<option value="">Choose Subject</option>';
  state.subjects.forEach(sub => {
    subSelect.innerHTML += `<option value="${sub.id}">${sub.name} (${sub.code})</option>`;
  });

  const { editLogId, subjectId, period, date } = options;

  if (editLogId) {
    document.getElementById('log-modal-title').textContent = 'Edit Log Entry';
    const log = state.logs.find(l => l.id === editLogId);
    if (log) {
      document.getElementById('log-edit-id').value = log.id;
      subSelect.value = log.subjectId;
      document.getElementById('log-type').value = log.type;
      document.getElementById('log-date').value = log.date;
      document.getElementById('log-period').value = log.period;
      document.getElementById('log-duration').value = log.durationMinutes;
      
      updateLogUnitDropdown(log.subjectId, log.unitNumber);
      updateLogTopicDropdown(log.subjectId, log.unitNumber, log.topicTaught);
      
      document.getElementById('log-topic-taught').value = log.topicTaught || '';
      document.getElementById('log-method').value = log.method || 'Lecture';
      document.getElementById('log-attendance-read').value = log.attendancePercent ? `${log.attendancePercent}%` : 'Auto calculated';
      document.getElementById('log-homework').value = log.homework || '';
      document.getElementById('log-notes').value = log.notes || '';
      document.getElementById('log-next-topic').value = log.nextTopic || '';
      
      // Load attendance
      if (log.attendance) tempAttendanceMap = { ...log.attendance };
    }
  } else {
    document.getElementById('log-modal-title').textContent = 'Record Daily Academic Log';
    document.getElementById('log-edit-id').value = '';
    document.getElementById('log-date').value = date || new Date().toISOString().split('T')[0];
    
    if (subjectId) {
      subSelect.value = subjectId;
      document.getElementById('log-period').value = period || 1;
      updateLogUnitDropdown(subjectId);
      autoSuggestLogTopicAndNext(subjectId);
    } else if (state.subjects.length > 0) {
      const firstSubId = state.subjects[0].id;
      subSelect.value = firstSubId;
      updateLogUnitDropdown(firstSubId);
      autoSuggestLogTopicAndNext(firstSubId);
    }
  }

  checkLogDateForAcademicEvent();
  toggleLogFieldsBasedOnType();
  document.getElementById('log-type').addEventListener('change', toggleLogFieldsBasedOnType);

  showWizardStep(1);
  openModal('log-modal');
}

function toggleLogFieldsBasedOnType() {
  const type = document.getElementById('log-type').value;
  const fields = document.querySelectorAll('.collapsible-log-field');
  const indAtt = document.getElementById('indicator-step-2');
  
  if (['Holiday', 'Exam Day'].includes(type)) {
    fields.forEach(f => f.style.display = 'none');
    document.getElementById('log-topic-taught').required = false;
    if (indAtt) indAtt.style.opacity = '0.3';
  } else {
    fields.forEach(f => f.style.display = 'grid');
    document.getElementById('log-topic-taught').required = true;
    if (indAtt) indAtt.style.opacity = '1';
  }
}

function handleLogSubmit(e) {
  e.preventDefault();

  const editId = document.getElementById('log-edit-id').value;
  const subjectId = document.getElementById('log-subject-select').value;
  const type = document.getElementById('log-type').value;
  const date = document.getElementById('log-date').value;
  const period = parseInt(document.getElementById('log-period').value);
  const duration = parseInt(document.getElementById('log-duration').value) || 50;

  const unitNumber = parseInt(document.getElementById('log-unit').value) || 1;
  const topicTaught = document.getElementById('log-topic-taught').value;
  const method = document.getElementById('log-method').value;
  const homework = document.getElementById('log-homework').value;
  const notes = document.getElementById('log-notes').value;
  const nextTopic = document.getElementById('log-next-topic').value;

  // Calculate percentage
  let present = 0;
  let total = Object.keys(tempAttendanceMap).length;
  Object.values(tempAttendanceMap).forEach(v => {
    if (['P', 'L', 'PR'].includes(v)) present++;
  });
  const attendancePercent = total > 0 ? Math.round((present / total) * 100) : 100;

  const logData = {
    subjectId, type, date, period, durationMinutes: duration,
    unitNumber: ['Holiday', 'Exam Day'].includes(type) ? null : unitNumber,
    topicTaught: ['Holiday', 'Exam Day'].includes(type) ? '' : topicTaught,
    method: ['Holiday', 'Exam Day'].includes(type) ? null : method,
    attendancePercent,
    attendance: ['Holiday', 'Exam Day'].includes(type) ? null : { ...tempAttendanceMap },
    homework: ['Holiday', 'Exam Day'].includes(type) ? '' : homework,
    notes,
    nextTopic: ['Holiday', 'Exam Day'].includes(type) ? '' : nextTopic
  };

  if (editId) {
    const idx = state.logs.findIndex(l => l.id === editId);
    if (idx !== -1) {
      state.logs[idx] = { ...state.logs[idx], ...logData };
      showToast('Academic log updated');
    }
  } else {
    state.logs.push({ id: generateUUID(), ...logData });
    showToast('Log entry recorded successfully');
  }

  // Update syllabus progress
  if (!['Holiday', 'Exam Day'].includes(type) && topicTaught) {
    if (!state.checkedTopics[subjectId]) state.checkedTopics[subjectId] = {};
    state.checkedTopics[subjectId][`${unitNumber}:${topicTaught}`] = true;
  }

  saveState();
  closeModal('log-modal');
  renderLogs();
}

function deleteLog(logId) {
  if (confirm('Are you sure you want to delete this log?')) {
    state.logs = state.logs.filter(l => l.id !== logId);
    saveState();
    renderLogs();
    showToast('Log entry removed', 'danger');
  }
}

// ==========================================================================
// 5. STUDENT DATABASE MANAGEMENT CONTROLLER
// ==========================================================================
function renderStudents() {
  // Populate filter dropdowns dynamically from existing student profiles
  const depts = new Set();
  const sems = new Set();
  const secs = new Set();

  state.students.forEach(s => {
    if (s.department) depts.add(s.department);
    if (s.semester) sems.add(s.semester);
    if (s.section) secs.add(s.section);
  });

  const fDept = document.getElementById('filter-stud-dept');
  const fSem = document.getElementById('filter-stud-sem');
  const fSec = document.getElementById('filter-stud-sec');

  const curDept = fDept.value;
  const curSem = fSem.value;
  const curSec = fSec.value;

  fDept.innerHTML = '<option value="">All Depts</option>';
  depts.forEach(d => fDept.innerHTML += `<option value="${d}">${d}</option>`);
  fDept.value = curDept;

  fSem.innerHTML = '<option value="">All Semesters</option>';
  sems.forEach(s => fSem.innerHTML += `<option value="${s}">${s}</option>`);
  fSem.value = curSem;

  fSec.innerHTML = '<option value="">All Sections</option>';
  secs.forEach(s => fSec.innerHTML += `<option value="${s}">${s}</option>`);
  fSec.value = curSec;

  const tbody = document.getElementById('students-list-body');
  tbody.innerHTML = '';

  const selDept = fDept.value.toLowerCase();
  const selSem = fSem.value.toLowerCase();
  const selSec = fSec.value.toLowerCase();
  const searchVal = document.getElementById('filter-stud-search').value.toLowerCase();

  const filtered = state.students.filter(s => {
    if (selDept && s.department.toLowerCase() !== selDept) return false;
    if (selSem && s.semester.toLowerCase() !== selSem) return false;
    if (selSec && s.section.toLowerCase() !== selSec) return false;
    if (searchVal && !s.name.toLowerCase().includes(searchVal) && !s.rollNumber.toLowerCase().includes(searchVal)) return false;
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No students found matching filters.</td></tr>`;
    return;
  }

  filtered.forEach(std => {
    // Calculate overall attendance percentage
    const metrics = getStudentAttendanceMetrics(std.id);
    const attPct = metrics.totalClasses > 0 ? `${metrics.overallPercent}%` : '-';
    
    // Highlight shortage in row
    const rowClass = (metrics.totalClasses > 0 && metrics.overallPercent < 75) ? 'shortage-risk-row' : '';

    const row = document.createElement('tr');
    row.className = rowClass;
    row.innerHTML = `
      <td><strong>${std.rollNumber}</strong></td>
      <td>${std.registerNumber}</td>
      <td>${std.name}</td>
      <td>${std.department} - ${std.semester} - Sec ${std.section}</td>
      <td>
        <strong style="color:${metrics.overallPercent < 75 ? 'var(--color-danger)' : 'var(--color-success)'}">${attPct}</strong>
        ${metrics.overallPercent < 75 && metrics.totalClasses > 0 ? `<span class="shortage-badge">Shortage</span>` : ''}
      </td>
      <td style="text-align: right;">
        <button class="glass-btn secondary" style="font-size:11px; padding:6px 12px; margin-right:4px;" onclick="viewStudentProfile('${std.id}')">Profile</button>
        <button class="mini-icon-btn" onclick="openStudentModal('${std.id}')"><svg class="btn-icon" style="width:14px; height:14px;"><use href="#icon-edit"></use></svg></button>
        <button class="mini-icon-btn delete" onclick="deleteStudent('${std.id}')"><svg class="btn-icon" style="width:14px; height:14px;"><use href="#icon-trash"></use></svg></button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function viewStudentProfile(studentId) {
  window.location.hash = `student-profile?id=${studentId}`;
  navigate(`student-profile?id=${studentId}`);
}

function getStudentAttendanceMetrics(studentId) {
  const student = state.students.find(s => s.id === studentId);
  if (!student) return { totalClasses: 0, present: 0, overallPercent: 0, subjectWise: {} };

  // Find logs belonging to this student's exact class criteria
  const classLogs = state.logs.filter(log => {
    const subject = state.subjects.find(s => s.id === log.subjectId);
    return subject &&
           subject.department.toLowerCase() === student.department.toLowerCase() &&
           subject.yearSemester.toLowerCase() === student.semester.toLowerCase() &&
           (!subject.section || subject.section.toLowerCase() === student.section.toLowerCase()) &&
           log.attendance !== null &&
           log.attendance !== undefined;
  });

  let totalClasses = 0;
  let present = 0;
  const subjectWise = {};

  classLogs.forEach(log => {
    const status = log.attendance[studentId];
    if (status) {
      totalClasses++;
      if (['P', 'L', 'PR'].includes(status)) present++;

      if (!subjectWise[log.subjectId]) {
        subjectWise[log.subjectId] = { total: 0, present: 0 };
      }
      subjectWise[log.subjectId].total++;
      if (['P', 'L', 'PR'].includes(status)) subjectWise[log.subjectId].present++;
    }
  });

  const overallPercent = totalClasses > 0 ? Math.round((present / totalClasses) * 100) : 100;
  
  return { totalClasses, present, overallPercent, subjectWise };
}

function openStudentModal(studentId = '') {
  const form = document.getElementById('student-form');
  form.reset();

  if (studentId) {
    document.getElementById('student-modal-title').textContent = 'Edit Student Details';
    const std = state.students.find(s => s.id === studentId);
    if (std) {
      document.getElementById('stud-edit-id').value = std.id;
      document.getElementById('stud-name').value = std.name;
      document.getElementById('stud-roll').value = std.rollNumber;
      document.getElementById('stud-register').value = std.registerNumber;
      document.getElementById('stud-dept').value = std.department;
      document.getElementById('stud-year').value = std.year;
      document.getElementById('stud-sem').value = std.semester;
      document.getElementById('stud-sec').value = std.section;
      document.getElementById('stud-email').value = std.email || '';
      document.getElementById('stud-phone').value = std.phone || '';
    }
  } else {
    document.getElementById('student-modal-title').textContent = 'Register New Student';
    document.getElementById('stud-edit-id').value = '';
  }
  openModal('student-modal');
}

function handleStudentSubmit(e) {
  e.preventDefault();

  const editId = document.getElementById('stud-edit-id').value;
  const name = document.getElementById('stud-name').value;
  const roll = document.getElementById('stud-roll').value;
  const reg = document.getElementById('stud-register').value;
  const dept = document.getElementById('stud-dept').value;
  const year = document.getElementById('stud-year').value;
  const sem = document.getElementById('stud-sem').value;
  const sec = document.getElementById('stud-sec').value;
  const email = document.getElementById('stud-email').value;
  const phone = document.getElementById('stud-phone').value;

  if (editId) {
    const idx = state.students.findIndex(s => s.id === editId);
    if (idx !== -1) {
      state.students[idx] = { ...state.students[idx], name, rollNumber: roll, registerNumber: reg, department: dept, year, semester: sem, section: sec, email, phone };
      showToast('Student details updated');
    }
  } else {
    state.students.push({ id: generateUUID(), name, rollNumber: roll, registerNumber: reg, department: dept, year, semester: sem, section: sec, email, phone });
    showToast('Student registered successfully');
  }

  saveState();
  closeModal('student-modal');
  renderStudents();
}

function deleteStudent(studentId) {
  if (confirm('Delete this student profile from database? Attendance log maps for this student will be orphaned.')) {
    state.students = state.students.filter(s => s.id !== studentId);
    saveState();
    renderStudents();
    showToast('Student profile deleted', 'danger');
  }
}

// Bulk CSV/Excel imports parser
function handleCSVImport(e) {
  e.preventDefault();
  const dept = document.getElementById('imp-dept').value.trim();
  const sem = document.getElementById('imp-sem').value.trim();
  const sec = document.getElementById('imp-sec').value.trim();
  const fileInput = document.getElementById('imp-excel-file');
  const rawCSV = document.getElementById('imp-csv-data').value.trim();

  // Helper to register students from 2D array
  function importStudentRoster(rows) {
    let importedCount = 0;
    rows.forEach(cols => {
      if (cols.length >= 3) {
        const name = String(cols[0] || '').trim();
        const roll = String(cols[1] || '').trim();
        const reg = String(cols[2] || '').trim();
        const email = String(cols[3] || '').trim();
        const phone = String(cols[4] || '').trim();

        if (!name || !roll || !reg) return;

        // Check if duplicate roll number
        const existing = state.students.find(s => s.rollNumber === roll);
        if (!existing) {
          state.students.push({
            id: generateUUID(),
            name, rollNumber: roll, registerNumber: reg,
            department: dept, year: sem.includes('I') ? '3rd Year' : '4th Year', semester: sem, section: sec,
            email, phone
          });
          importedCount++;
        }
      }
    });

    if (importedCount > 0) {
      saveState();
      closeModal('student-import-modal');
      renderStudents();
      showToast(`Successfully imported ${importedCount} students!`);
    } else {
      showToast('No new students imported. Please check formats and duplicates.', 'warning');
    }
  }

  // Helper to parse text (CSV or Tab-Delimited TSV)
  function parseTextData(text) {
    const lines = text.split('\n');
    const parsedRows = [];
    lines.forEach(line => {
      const cleanLine = line.trim();
      if (cleanLine.length === 0) return;

      // Detect tab-separated values vs comma-separated values
      let cols = [];
      if (cleanLine.includes('\t')) {
        cols = cleanLine.split('\t').map(c => c.replace(/^"|"$/g, '').trim());
      } else {
        cols = cleanLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
      }
      parsedRows.push(cols);
    });
    importStudentRoster(parsedRows);
  }

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const fileExt = file.name.split('.').pop().toLowerCase();
    const reader = new FileReader();

    if (fileExt === 'xlsx' || fileExt === 'xls') {
      reader.onload = function(evt) {
        try {
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          // Convert sheet to 2D array of rows
          const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // If the first row contains headers, we skip it
          let dataRows = rows;
          if (rows.length > 0) {
            const firstCol = String(rows[0][0] || '').toLowerCase();
            const secondCol = String(rows[0][1] || '').toLowerCase();
            if (firstCol.includes('name') || secondCol.includes('roll') || firstCol.includes('student') || secondCol.includes('register')) {
              dataRows = rows.slice(1);
            }
          }
          importStudentRoster(dataRows);
        } catch (err) {
          showToast('Failed to parse Excel file. Is it corrupted?', 'danger');
          console.error(err);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Treat as plain text (CSV / TSV)
      reader.onload = function(evt) {
        parseTextData(evt.target.result);
      };
      reader.readAsText(file);
    }
    // Reset file input so same file can be reloaded if needed
    fileInput.value = '';
  } else if (rawCSV) {
    parseTextData(rawCSV);
  } else {
    showToast('Please upload a file or paste data in the text area.', 'warning');
  }
}

// ==========================================================================
// 6. STUDENT PROFILE CONTROLLER
// ==========================================================================
function renderStudentProfile(studentId) {
  const student = state.students.find(s => s.id === studentId);
  if (!student) {
    navigate('students');
    return;
  }

  // Set Profile Name
  document.getElementById('profile-student-title').textContent = `${student.name} (${student.rollNumber})`;

  // Info Block
  const infoBlock = document.getElementById('profile-info-block');
  infoBlock.innerHTML = `
    <div class="profile-info-item"><span>Roll Number</span><strong>${student.rollNumber}</strong></div>
    <div class="profile-info-item"><span>Register Number</span><strong>${student.registerNumber}</strong></div>
    <div class="profile-info-item"><span>Department</span><strong>${student.department}</strong></div>
    <div class="profile-info-item"><span>Semester / Sec</span><strong>${student.semester} - Section ${student.section}</strong></div>
    <div class="profile-info-item"><span>Email</span><strong>${student.email || 'Not Configured'}</strong></div>
    <div class="profile-info-item"><span>Phone</span><strong>${student.phone || 'Not Configured'}</strong></div>
  `;

  // Get metrics
  const metrics = getStudentAttendanceMetrics(studentId);
  
  // Calculate stats
  const metricsBlock = document.getElementById('profile-metrics-block');
  metricsBlock.innerHTML = `
    <div class="profile-metric-row">
      <div class="profile-metric-labels"><span>Overall Attendance Average</span><span>${metrics.overallPercent}%</span></div>
      <div class="progress-bar-track" style="height:12px;"><div class="progress-bar-fill" style="width: ${metrics.overallPercent}%; background-color:${metrics.overallPercent < 75 ? 'var(--color-danger)' : 'var(--color-success)'};"></div></div>
    </div>
    <div style="margin-top:20px; display:flex; flex-direction:column; gap:12px;">
      <h4 style="font-size:13px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Subject-wise Breakdown</h4>
      ${state.subjects.filter(sub => 
          sub.department.toLowerCase() === student.department.toLowerCase() &&
          sub.yearSemester.toLowerCase() === student.semester.toLowerCase() &&
          (!sub.section || sub.section.toLowerCase() === student.section.toLowerCase())
        ).map(sub => {
          const subMetrics = metrics.subjectWise[sub.id] || { total: 0, present: 0 };
          const subPct = subMetrics.total > 0 ? Math.round((subMetrics.present / subMetrics.total) * 100) : 100;
          return `
            <div class="profile-metric-row" style="background:rgba(0,0,0,0.1); padding:10px; border-radius:var(--border-radius-sm);">
              <div class="profile-metric-labels" style="font-size:12px;">
                <span>${sub.name} (${sub.code})</span>
                <strong>${subPct}% (${subMetrics.present}/${subMetrics.total})</strong>
              </div>
              <div class="progress-bar-track" style="height:6px; margin-top:4px;">
                <div class="progress-bar-fill" style="width: ${subPct}%; background:${subPct < 75 ? 'var(--color-danger)' : 'linear-gradient(90deg, var(--color-primary), var(--color-info))'}"></div>
              </div>
            </div>
          `;
        }).join('')
      }
    </div>
  `;

  // History list
  const historyBody = document.getElementById('profile-history-body');
  historyBody.innerHTML = '';

  const classLogs = state.logs.filter(log => {
    const subject = state.subjects.find(s => s.id === log.subjectId);
    return subject &&
           subject.department.toLowerCase() === student.department.toLowerCase() &&
           subject.yearSemester.toLowerCase() === student.semester.toLowerCase() &&
           (!subject.section || subject.section.toLowerCase() === student.section.toLowerCase()) &&
           log.attendance !== null &&
           log.attendance !== undefined &&
           log.attendance[studentId] !== undefined;
  });

  classLogs.sort((a,b) => b.date.localeCompare(a.date) || b.period - a.period);

  if (classLogs.length === 0) {
    historyBody.innerHTML = `<tr><td colspan="5" class="empty-state">No attendance records generated yet.</td></tr>`;
    return;
  }

  classLogs.forEach(log => {
    const subject = state.subjects.find(s => s.id === log.subjectId);
    const status = log.attendance[studentId];
    
    let statusPill = `<span class="log-type-tag completed">Present</span>`;
    if (status === 'A') statusPill = `<span class="log-type-tag missed">Absent</span>`;
    if (status === 'L') statusPill = `<span class="log-type-tag pending">Late</span>`;
    if (status === 'M') statusPill = `<span class="log-type-tag pending" style="background:rgba(255,159,10,0.15); color:var(--accent-orange);">Medical</span>`;
    if (status === 'PR') statusPill = `<span class="log-type-tag lab">Permission</span>`;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${log.date}</strong></td>
      <td>Period ${log.period}</td>
      <td>${subject ? subject.code : 'N/A'}</td>
      <td>${log.topicTaught || `(${log.type})`}</td>
      <td>${statusPill}</td>
    `;
    historyBody.appendChild(row);
  });
}

// ==========================================================================
// 7. SMART ANALYTICS CONTROLLER
// ==========================================================================
function renderAnalytics() {
  // Get all active students overall metrics
  let totalClassAttendancePct = 0;
  let studentsWithStats = 0;
  let shortageCount = 0;
  
  let topStudent = null;
  let topPct = -1;
  let lowStudent = null;
  let lowPct = 101;

  const shortageListContainer = document.getElementById('anal-shortage-list');
  shortageListContainer.innerHTML = '';

  state.students.forEach(std => {
    const metrics = getStudentAttendanceMetrics(std.id);
    if (metrics.totalClasses > 0) {
      studentsWithStats++;
      totalClassAttendancePct += metrics.overallPercent;

      if (metrics.overallPercent < 75) {
        shortageCount++;
        // Add to alert shortlist
        const div = document.createElement('div');
        div.className = 'alert-item danger';
        div.style.padding = '10px 14px';
        div.innerHTML = `
          <div class="alert-icon color-danger" style="margin-top:0;"><svg class="btn-icon" style="width:14px; height:14px;"><use href="#icon-alert"></use></svg></div>
          <div class="alert-content">
            <h4 style="font-size:12px; margin:0;">${std.name} (${std.rollNumber})</h4>
            <p style="font-size:11px; margin:0;">Attendance: <strong style="color:var(--color-danger);">${metrics.overallPercent}%</strong> (${metrics.present}/${metrics.totalClasses} classes)</p>
          </div>
        `;
        shortageListContainer.appendChild(div);
      }

      if (metrics.overallPercent > topPct) {
        topPct = metrics.overallPercent;
        topStudent = std;
      }
      if (metrics.overallPercent < lowPct) {
        lowPct = metrics.overallPercent;
        lowStudent = std;
      }
    }
  });

  const classAvg = studentsWithStats > 0 ? Math.round(totalClassAttendancePct / studentsWithStats) : 100;
  document.getElementById('anal-class-avg').textContent = `${classAvg}%`;
  document.getElementById('anal-shortage-count').textContent = shortageCount;
  document.getElementById('anal-top-attendee').innerHTML = topStudent ? `${topStudent.name}<br><strong>${topPct}%</strong>` : 'N/A';
  document.getElementById('anal-low-attendee').innerHTML = lowStudent ? `${lowStudent.name}<br><strong>${lowPct}%</strong>` : 'N/A';

  if (shortageCount === 0) {
    shortageListContainer.innerHTML = `<div class="empty-state" style="padding:20px;"><p>No student shortages registered.</p></div>`;
  }

  // Draw trend graph
  drawTrendCharts();
}

function drawTrendCharts() {
  const canvas = document.getElementById('monthlyTrendChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Simple vanilla chart drawing
  const w = canvas.width;
  const h = canvas.height;
  const padding = 40;

  // Draw axes
  ctx.strokeStyle = state.theme === 'dark-mode' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, h - padding);
  ctx.lineTo(w - padding, h - padding);
  ctx.stroke();

  // Y Axis ticks (0%, 25%, 50%, 75%, 100%)
  const yTicks = [0, 25, 50, 75, 100];
  ctx.fillStyle = state.theme === 'dark-mode' ? '#86868b' : '#6e6e73';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  yTicks.forEach(tick => {
    const y = (h - padding) - (tick / 100) * (h - 2 * padding);
    ctx.fillText(`${tick}%`, padding - 10, y);
    // Grid line
    ctx.strokeStyle = state.theme === 'dark-mode' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(w - padding, y);
    ctx.stroke();
  });

  // Calculate monthly stats from logs (last 6 months)
  const today = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({
      label: MONTH_NAMES[d.getMonth()].substring(0, 3),
      monthIdx: d.getMonth(),
      year: d.getFullYear(),
      totalPercentSum: 0,
      logsCount: 0
    });
  }

  state.logs.forEach(log => {
    const logDate = new Date(log.date);
    months.forEach(m => {
      if (logDate.getMonth() === m.monthIdx && logDate.getFullYear() === m.year && log.attendancePercent !== null) {
        m.totalPercentSum += log.attendancePercent;
        m.logsCount++;
      }
    });
  });

  // Plot monthly bars
  const numBars = months.length;
  const chartWidth = w - 2 * padding;
  const barSpacer = chartWidth / numBars;
  
  months.forEach((m, idx) => {
    const avg = m.logsCount > 0 ? Math.round(m.totalPercentSum / m.logsCount) : 80; // default/mock
    const barWidth = 30;
    const x = padding + idx * barSpacer + (barSpacer - barWidth) / 2;
    const yVal = (avg / 100) * (h - 2 * padding);
    const y = h - padding - yVal;

    // Draw Bar
    const gradient = ctx.createLinearGradient(0, y, 0, h - padding);
    gradient.addColorStop(0, '#0071e3');
    gradient.addColorStop(1, 'rgba(0, 113, 227, 0.2)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, yVal, [4, 4, 0, 0]);
    ctx.fill();

    // Bar label/value
    ctx.fillStyle = state.theme === 'dark-mode' ? '#f5f5f7' : '#1d1d1f';
    ctx.textAlign = 'center';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`${avg}%`, x + barWidth/2, y - 10);

    // X axis label
    ctx.fillStyle = state.theme === 'dark-mode' ? '#86868b' : '#6e6e73';
    ctx.font = '10px sans-serif';
    ctx.fillText(m.label, x + barWidth/2, h - padding + 15);
  });
}

// ==========================================================================
// 8. REPORTS CONTROLLER
// ==========================================================================
function renderReports() {
  const subSelect = document.getElementById('report-subject');
  subSelect.innerHTML = '<option value="">All Subjects</option>';
  state.subjects.forEach(sub => {
    subSelect.innerHTML += `<option value="${sub.id}">${sub.name} (${sub.code})</option>`;
  });

  const today = new Date();
  const monthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  document.getElementById('report-month').value = monthStr;

  generateReportPreview();
}

function generateReportPreview() {
  const reportType = document.getElementById('report-type-select').value;
  const subId = document.getElementById('report-subject').value;
  const monthVal = document.getElementById('report-month').value; 
  const preview = document.getElementById('report-preview-container');
  preview.innerHTML = '';

  if (!monthVal) {
    preview.innerHTML = '<div class="empty-state"><p>Select month to view report.</p></div>';
    return;
  }

  const [year, month] = monthVal.split('-');
  const filterMonthIndex = parseInt(month) - 1;

  if (reportType === 'logbook') {
    // Generate standard Academic Logbook Report
    const logsFiltered = state.logs.filter(log => {
      if (subId && log.subjectId !== subId) return false;
      const logDate = new Date(log.date);
      return logDate.getMonth() === filterMonthIndex && logDate.getFullYear() === parseInt(year);
    });

    logsFiltered.sort((a,b) => a.date.localeCompare(b.date) || a.period - b.period);
    const headerSubjectText = subId ? state.subjects.find(s => s.id === subId)?.name : 'All Assigned Subjects';
    const totalClassesTaken = logsFiltered.filter(l => ['Completed', 'Lab Day'].includes(l.type)).length;
    const totalMissed = logsFiltered.filter(l => l.type === 'Missed').length;
    const totalHolidays = logsFiltered.filter(l => l.type === 'Holiday').length;
    
    const attendanceLogs = logsFiltered.filter(l => l.attendancePercent !== null);
    const avgAttendance = attendanceLogs.length > 0 ? Math.round(attendanceLogs.reduce((sum, l) => sum + l.attendancePercent, 0) / attendanceLogs.length) : 0;

    preview.innerHTML = `
      <div class="report-preview-header">
        <h2>Academic Logbook Report</h2>
        <p style="font-size:14px; font-weight:600; color:var(--text-muted);">${headerSubjectText}</p>
        <p style="font-size:12px; color:var(--text-muted);">${MONTH_NAMES[filterMonthIndex]} ${year}</p>
      </div>

      <div class="report-summary-boxes">
        <div class="summary-box"><span>Classes Handled</span><h4>${totalClassesTaken}</h4></div>
        <div class="summary-box"><span>Missed Classes</span><h4 style="color:var(--color-danger);">${totalMissed}</h4></div>
        <div class="summary-box"><span>Holidays/Leaves</span><h4>${totalHolidays}</h4></div>
        <div class="summary-box"><span>Avg Attendance</span><h4 style="color:var(--color-success);">${avgAttendance}%</h4></div>
      </div>

      ${logsFiltered.length === 0 
        ? `<div class="empty-state"><p>No log records stored for selected filters.</p></div>`
        : `
          <div class="report-table-wrapper">
            <table class="report-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Period</th>
                  <th>Subject</th>
                  <th>Unit</th>
                  <th>Topic Completed</th>
                  <th>Method</th>
                  <th>Att. %</th>
                  <th>Homework & Notes</th>
                </tr>
              </thead>
              <tbody>
                ${logsFiltered.map(log => {
                  const sub = state.subjects.find(s => s.id === log.subjectId);
                  const subLabel = sub ? `${sub.code}` : 'N/A';
                  return `
                    <tr>
                      <td><strong>${log.date}</strong></td>
                      <td>P${log.period}</td>
                      <td>${subLabel}</td>
                      <td>${log.unitNumber || '-'}</td>
                      <td>${log.topicTaught || `<span class="subtitle font-smaller" style="color:var(--color-warning);">${log.type}</span>`}</td>
                      <td>${log.method || '-'}</td>
                      <td>${log.attendancePercent !== null ? `${log.attendancePercent}%` : '-'}</td>
                      <td>
                        ${log.homework ? `<strong>HW:</strong> ${log.homework}<br>` : ''}
                        ${log.notes ? `<strong>Notes:</strong> ${log.notes}` : ''}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `
      }
    `;
  } else {
    // Generate Register Grid format
    // Requires a subject filter
    if (!subId) {
      preview.innerHTML = '<div class="empty-state"><p>Attendance Register grid requires a specific Subject to be selected.</p></div>';
      return;
    }

    const subjectObj = state.subjects.find(s => s.id === subId);
    if (!subjectObj) return;

    // Filter students belonging to this class/section
    const studentsMatching = state.students.filter(s => 
      s.department.toLowerCase() === subjectObj.department.toLowerCase() &&
      s.semester.toLowerCase() === subjectObj.yearSemester.toLowerCase() &&
      (!subjectObj.section || s.section.toLowerCase() === subjectObj.section.toLowerCase())
    );

    // Get logs in that month for that subject
    const subjectLogs = state.logs.filter(log => {
      const logDate = new Date(log.date);
      return log.subjectId === subId && 
             logDate.getMonth() === filterMonthIndex && 
             logDate.getFullYear() === parseInt(year) &&
             log.attendance !== null &&
             log.attendance !== undefined;
    });

    // Sort logs chronologically to draw columns
    subjectLogs.sort((a,b) => a.date.localeCompare(b.date) || a.period - b.period);

    preview.innerHTML = `
      <div class="report-preview-header">
        <h2>Attendance Register Grid</h2>
        <p style="font-size:14px; font-weight:600; color:var(--text-muted);">${subjectObj.name} (${subjectObj.code})</p>
        <p style="font-size:12px; color:var(--text-muted);">${subjectObj.department} - Sem ${subjectObj.yearSemester} - Section ${subjectObj.section} | ${MONTH_NAMES[filterMonthIndex]} ${year}</p>
      </div>

      ${studentsMatching.length === 0 
        ? `<div class="empty-state"><p>No students mapped to this subject class.</p></div>`
        : `
          <div class="report-table-wrapper">
            <table class="report-table" style="font-size:11px; text-align:center;">
              <thead>
                <tr>
                  <th style="text-align:left;">Student Name</th>
                  <th style="text-align:left;">Roll</th>
                  ${subjectLogs.map(l => {
                    const shortDate = l.date.substring(8, 10) + '/' + l.date.substring(5, 7);
                    return `<th title="${l.topicTaught}">${shortDate}<br><span class="time-sub">P${l.period}</span></th>`;
                  }).join('')}
                  <th>Total (%)</th>
                </tr>
              </thead>
              <tbody>
                ${studentsMatching.map(std => {
                  let stdPresent = 0;
                  let stdTotal = 0;

                  const cellsMarkup = subjectLogs.map(l => {
                    const status = l.attendance[std.id];
                    if (status) {
                      stdTotal++;
                      if (['P', 'L', 'PR'].includes(status)) stdPresent++;
                      
                      let cellClass = '';
                      if (status === 'P') cellClass = 'color:var(--color-success); font-weight:bold;';
                      if (status === 'A') cellClass = 'color:var(--color-danger); font-weight:bold;';
                      return `<td style="${cellClass}">${status}</td>`;
                    }
                    return `<td>-</td>`;
                  }).join('');

                  const pct = stdTotal > 0 ? Math.round((stdPresent / stdTotal) * 100) : 100;

                  return `
                    <tr>
                      <td style="text-align:left;"><strong>${std.name}</strong></td>
                      <td style="text-align:left;">${std.rollNumber}</td>
                      ${cellsMarkup}
                      <td><strong style="color:${pct < 75 ? 'var(--color-danger)' : 'var(--color-success)'}">${pct}%</strong></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `
      }
    `;
  }
}

// Generate Excel CSV file (Handles attendance mapping strings too)
function exportReportCSV() {
  const subId = document.getElementById('report-subject').value;
  const monthVal = document.getElementById('report-month').value;
  
  if (!monthVal) {
    showToast('Choose report month first', 'warning');
    return;
  }

  const [year, month] = monthVal.split('-');
  const filterMonthIndex = parseInt(month) - 1;

  const logsFiltered = state.logs.filter(log => {
    if (subId && log.subjectId !== subId) return false;
    const logDate = new Date(log.date);
    return logDate.getMonth() === filterMonthIndex && logDate.getFullYear() === parseInt(year);
  });

  if (logsFiltered.length === 0) {
    showToast('No records found to export.', 'warning');
    return;
  }

  logsFiltered.sort((a,b) => a.date.localeCompare(b.date) || a.period - b.period);

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Date,Period,Subject,Code,Unit,Topic Taught,Method,Duration(mins),Attendance(%),Homework,Notes\n";

  logsFiltered.forEach(log => {
    const sub = state.subjects.find(s => s.id === log.subjectId);
    const subName = sub ? sub.name : 'N/A';
    const subCode = sub ? sub.code : 'N/A';
    
    const cleanTopic = (log.topicTaught || log.type).replace(/"/g, '""');
    const cleanMethod = (log.method || '-').replace(/"/g, '""');
    const cleanHW = (log.homework || '').replace(/"/g, '""');
    const cleanNotes = (log.notes || '').replace(/"/g, '""');

    csvContent += `"${log.date}",${log.period},"${subName}","${subCode}",${log.unitNumber || '-'},"${cleanTopic}","${cleanMethod}",${log.durationMinutes},${log.attendancePercent !== null ? log.attendancePercent : '-'},"${cleanHW}","${cleanNotes}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `ERP_Academic_Report_${monthVal}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Spreadsheet exported');
}

// ==========================================================================
// 9. GLOBAL SEARCH
// ==========================================================================
function renderSearch() {
  const query = document.getElementById('global-search-input').value.toLowerCase().trim();
  const resultsContainer = document.getElementById('search-results-list');
  const meta = document.getElementById('search-meta');
  
  resultsContainer.innerHTML = '';

  if (!query) {
    meta.textContent = 'Type keyword to search logs';
    return;
  }

  const results = state.logs.filter(log => {
    const sub = state.subjects.find(s => s.id === log.subjectId);
    const subName = sub ? sub.name.toLowerCase() : '';
    const subCode = sub ? sub.code.toLowerCase() : '';
    const topic = (log.topicTaught || '').toLowerCase();
    const notes = (log.notes || '').toLowerCase();
    const hw = (log.homework || '').toLowerCase();
    const method = (log.method || '').toLowerCase();
    
    // Search student names in log attendance
    let studMatch = false;
    if (log.attendance) {
      Object.keys(log.attendance).forEach(stdId => {
        const std = state.students.find(s => s.id === stdId);
        if (std && (std.name.toLowerCase().includes(query) || std.rollNumber.toLowerCase().includes(query))) {
          studMatch = true;
        }
      });
    }

    return subName.includes(query) ||
           subCode.includes(query) ||
           topic.includes(query) ||
           notes.includes(query) ||
           hw.includes(query) ||
           method.includes(query) ||
           studMatch ||
           log.date.includes(query);
  });

  meta.textContent = `Found ${results.length} matching log entries`;

  if (results.length === 0) {
    resultsContainer.innerHTML = '<div class="empty-state"><p>No log records match search keyword.</p></div>';
    return;
  }

  results.forEach(log => {
    const subject = state.subjects.find(s => s.id === log.subjectId);
    const subName = subject ? `${subject.name} (${subject.code})` : 'Deleted Subject';

    const card = document.createElement('div');
    card.className = 'log-card glass-card';
    card.style.borderLeft = `4px solid ${log.type === 'Completed' ? 'var(--color-success)' : 'var(--color-warning)'}`;
    card.innerHTML = `
      <div class="log-card-header" style="margin-bottom:8px;">
        <div class="log-card-meta">
          <span class="log-date-label">${log.date}</span>
          <span class="log-period-pill">Period ${log.period}</span>
          <span class="log-type-tag ${log.type.toLowerCase().replace(' ', '-')}">${log.type}</span>
        </div>
      </div>
      <div class="log-card-body">
        <div class="log-subject-name">${subName}</div>
        <h4 class="topic-title">${log.topicTaught || log.type}</h4>
        <p class="subtitle font-smaller" style="margin-top:-6px;">Unit ${log.unitNumber || '-'}</p>
        ${log.notes ? `<p class="log-notes-text"><strong>Notes:</strong> ${log.notes}</p>` : ''}
      </div>
    `;
    resultsContainer.appendChild(card);
  });
}

// ==========================================================================
// 10. ACADEMIC CALENDAR CONTROLLER
// ==========================================================================
function changeCalendarMonth(offset) {
  currentCalendarMonth += offset;
  if (currentCalendarMonth < 0) {
    currentCalendarMonth = 11;
    currentCalendarYear--;
  } else if (currentCalendarMonth > 11) {
    currentCalendarMonth = 0;
    currentCalendarYear++;
  }
  renderCalendar();
}

const eventTypeClasses = {
  'Holiday': 'holiday',
  'Exam Day': 'exam-day',
  'Lab Day': 'lab-day',
  'Special Event': 'special-event'
};

function renderCalendar() {
  document.getElementById('calendar-month-year').textContent = `${MONTH_NAMES[currentCalendarMonth]} ${currentCalendarYear}`;

  const container = document.getElementById('calendar-days-container');
  container.innerHTML = '';

  const firstDay = new Date(currentCalendarYear, currentCalendarMonth, 1).getDay();
  const totalDays = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
  const totalDaysPrev = new Date(currentCalendarYear, currentCalendarMonth, 0).getDate();

  for (let i = firstDay - 1; i >= 0; i--) {
    const prevDay = totalDaysPrev - i;
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell other-month';
    cell.innerHTML = `<span class="calendar-day-number">${prevDay}</span>`;
    container.appendChild(cell);
  }

  for (let day = 1; day <= totalDays; day++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell';
    const dayDateStr = `${currentCalendarYear}-${String(currentCalendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const dayLogs = state.logs.filter(l => l.date === dayDateStr);
    const dayEvent = state.academicEvents[dayDateStr];
    
    let eventHtml = '';
    if (dayEvent) {
      const cls = eventTypeClasses[dayEvent.type] || 'special-event';
      const sub = dayEvent.subjectId ? state.subjects.find(s => s.id === dayEvent.subjectId) : null;
      const subSuffix = sub ? ` (${sub.code})` : '';
      eventHtml = `<span class="calendar-event-label ${cls}" title="${dayEvent.title}">${dayEvent.title}${subSuffix}</span>`;
    }

    cell.innerHTML = `
      <span class="calendar-day-number">${day}</span>
      <div class="calendar-day-events">
        ${eventHtml}
        ${dayLogs.map(log => {
          const sub = state.subjects.find(s => s.id === log.subjectId);
          const displayLabel = sub ? `${sub.code} (P${log.period})` : `Class (P${log.period})`;
          return `<span class="calendar-mini-event ${log.type.toLowerCase().replace(' ', '-')}" title="${log.topicTaught || log.type}">${displayLabel}</span>`;
        }).join('')}
      </div>
    `;

    cell.addEventListener('click', () => {
      openCalendarDateModal(dayDateStr);
    });

    container.appendChild(cell);
  }

  const totalCellsSoFar = firstDay + totalDays;
  const remainingCells = 42 - totalCellsSoFar;
  for (let nextDay = 1; nextDay <= remainingCells; nextDay++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell other-month';
    cell.innerHTML = `<span class="calendar-day-number">${nextDay}</span>`;
    container.appendChild(cell);
  }
}

function openCalendarDateModal(dateStr) {
  document.getElementById('cal-date-hidden').value = dateStr;
  
  const dateObj = new Date(dateStr + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  document.getElementById('cal-date-modal-title').textContent = `Options for ${formattedDate}`;

  const dayLogs = state.logs.filter(l => l.date === dateStr);
  const dayEvent = state.academicEvents[dateStr];

  const statusBlock = document.getElementById('cal-date-status-block');
  statusBlock.innerHTML = '';

  if (dayEvent) {
    const cls = eventTypeClasses[dayEvent.type] || 'special-event';
    const sub = dayEvent.subjectId ? state.subjects.find(s => s.id === dayEvent.subjectId) : null;
    const subText = sub ? ` for ${sub.name} (${sub.code})` : '';
    
    statusBlock.innerHTML += `
      <div class="calendar-event-label ${cls}" style="font-size: 13px; padding: 10px 14px; border-radius: var(--border-radius-md); display: flex; flex-direction: column; gap: 4px; white-space: normal; height: auto;">
        <span style="font-weight: bold; font-size: 11px; text-transform: uppercase;">${dayEvent.type}</span>
        <span style="font-size: 14px; font-weight: 500;">${dayEvent.title}</span>
        ${subText ? `<span style="font-size: 12px; opacity: 0.9;">${subText}</span>` : ''}
      </div>
    `;
  }

  if (dayLogs.length > 0) {
    statusBlock.innerHTML += `<div style="font-weight: 600; margin-top: 8px; font-size: 12px; opacity: 0.7;">Class logs:</div>`;
    dayLogs.forEach(log => {
      const sub = state.subjects.find(s => s.id === log.subjectId);
      const subName = sub ? `${sub.name} (${sub.code})` : 'Class';
      const typeCls = log.type.toLowerCase().replace(' ', '-');
      statusBlock.innerHTML += `
        <div style="background: var(--glass-card-bg); border: 1px solid var(--glass-card-border); padding: 10px; border-radius: var(--border-radius-md); display: flex; flex-direction: column; gap: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600;">${subName}</span>
            <span class="calendar-mini-event ${typeCls}" style="padding: 2px 6px; font-size: 10px; border-radius: 4px; margin-top: 0; line-height: 1.2;">Period ${log.period}</span>
          </div>
          ${log.topicTaught ? `<div style="opacity: 0.8; font-size: 12px;"><strong>Topic:</strong> ${log.topicTaught}</div>` : ''}
          ${log.unitNumber ? `<div style="opacity: 0.8; font-size: 12px;"><strong>Unit:</strong> ${log.unitNumber}</div>` : ''}
        </div>
      `;
    });
  }

  if (!dayEvent && dayLogs.length === 0) {
    statusBlock.innerHTML = `
      <div style="text-align: center; padding: 20px; opacity: 0.6; font-style: italic;">
        No events scheduled or class logs recorded for this day.
      </div>
    `;
  }

  const configBtn = document.getElementById('btn-cal-config-event');
  if (dayEvent) {
    configBtn.innerHTML = `
      <svg class="btn-icon"><use href="#icon-calendar"></use></svg>
      Edit Academic Event
    `;
  } else {
    configBtn.innerHTML = `
      <svg class="btn-icon"><use href="#icon-calendar"></use></svg>
      Configure Academic Event
    `;
  }

  openModal('calendar-date-modal');
}

function openCalendarEventModal(dateStr) {
  closeModal('calendar-date-modal');

  document.getElementById('event-date-hidden').value = dateStr;
  
  const dateObj = new Date(dateStr + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  document.getElementById('cal-event-modal-title').textContent = `Configure Event: ${formattedDate}`;

  const subSelect = document.getElementById('event-subject-select');
  subSelect.innerHTML = '<option value="">None (Applies to all)</option>';
  state.subjects.forEach(sub => {
    subSelect.innerHTML += `<option value="${sub.id}">${sub.name} (${sub.code})</option>`;
  });

  const existingEvent = state.academicEvents[dateStr];
  const deleteBtn = document.getElementById('btn-delete-calendar-event');
  
  if (existingEvent) {
    document.getElementById('event-type-select').value = existingEvent.type;
    document.getElementById('event-title-input').value = existingEvent.title;
    document.getElementById('event-subject-select').value = existingEvent.subjectId || '';
    deleteBtn.style.display = 'block';
  } else {
    document.getElementById('event-type-select').value = 'Holiday';
    document.getElementById('event-title-input').value = '';
    document.getElementById('event-subject-select').value = '';
    deleteBtn.style.display = 'none';
  }

  toggleEventSubjectField();
  openModal('calendar-event-modal');
}

function toggleEventSubjectField() {
  const type = document.getElementById('event-type-select').value;
  const group = document.getElementById('event-subject-group');
  if (['Exam Day', 'Lab Day'].includes(type)) {
    group.style.display = 'block';
  } else {
    group.style.display = 'none';
    document.getElementById('event-subject-select').value = '';
  }
}

function handleCalendarEventSubmit(e) {
  e.preventDefault();
  const dateStr = document.getElementById('event-date-hidden').value;
  const type = document.getElementById('event-type-select').value;
  const title = document.getElementById('event-title-input').value.trim();
  const subjectId = document.getElementById('event-subject-select').value || undefined;

  if (!title) {
    showToast('Event title is required.', 'danger');
    return;
  }

  state.academicEvents[dateStr] = {
    date: dateStr,
    type,
    title,
    subjectId
  };

  saveState();
  closeModal('calendar-event-modal');
  renderCalendar();
  renderDashboard();
  showToast(`Event configured for ${dateStr}`);
}

function deleteCalendarEvent() {
  const dateStr = document.getElementById('event-date-hidden').value;
  if (state.academicEvents[dateStr]) {
    delete state.academicEvents[dateStr];
    saveState();
    closeModal('calendar-event-modal');
    renderCalendar();
    renderDashboard();
    showToast('Academic event deleted');
  }
}

function checkLogDateForAcademicEvent() {
  const dateVal = document.getElementById('log-date').value;
  const warningDiv = document.getElementById('log-event-warning');
  if (!warningDiv) return;

  const event = state.academicEvents[dateVal];
  if (event) {
    const clsSuffix = eventTypeClasses[event.type] || 'special-event';
    warningDiv.className = `calendar-event-label ${clsSuffix}`;
    warningDiv.style.display = 'block';
    warningDiv.style.fontSize = '13px';
    warningDiv.style.padding = '10px 14px';
    warningDiv.style.borderRadius = 'var(--border-radius-md)';
    warningDiv.style.height = 'auto';
    warningDiv.style.whiteSpace = 'normal';
    warningDiv.style.marginBottom = '16px';
    warningDiv.innerHTML = `
      <div style="font-weight: bold; font-size: 11px; text-transform: uppercase;">Note: Academic Event Scheduled</div>
      <div style="font-size: 14px; font-weight: 600; margin-top: 2px;">${event.title} (${event.type})</div>
    `;
    
    const logEditId = document.getElementById('log-edit-id').value;
    if (!logEditId) {
      const typeSelect = document.getElementById('log-type');
      if (event.type === 'Holiday') {
        typeSelect.value = 'Holiday';
      } else if (event.type === 'Exam Day') {
        typeSelect.value = 'Exam Day';
      } else if (event.type === 'Lab Day') {
        typeSelect.value = 'Lab Day';
      }
      toggleLogFieldsBasedOnType();
    }
  } else {
    warningDiv.style.display = 'none';
    warningDiv.innerHTML = '';
  }
}

// ==========================================================================
// 11. SYLLABUS PROGRESS TRACKER
// ==========================================================================
function renderProgress() {
  const subSelect = document.getElementById('progress-subject-select');
  const selectedSubVal = subSelect.value;
  subSelect.innerHTML = '';
  
  if (state.subjects.length === 0) {
    subSelect.innerHTML = '<option value="">No Subjects</option>';
    document.getElementById('progress-container').innerHTML = `<div class="empty-state"><p>No subjects configured.</p></div>`;
    return;
  }

  state.subjects.forEach(sub => {
    subSelect.innerHTML += `<option value="${sub.id}">${sub.name} (${sub.code})</option>`;
  });

  if (!activeSyllabusSubjectId || !state.subjects.find(s => s.id === activeSyllabusSubjectId)) {
    activeSyllabusSubjectId = state.subjects[0].id;
  }
  subSelect.value = activeSyllabusSubjectId;

  const currentSubject = state.subjects.find(s => s.id === activeSyllabusSubjectId);
  const container = document.getElementById('progress-container');
  container.innerHTML = '';

  if (currentSubject) {
    const syllabus = currentSubject.syllabus || {};
    let totalTopics = 0;
    Object.values(syllabus).forEach(arr => totalTopics += arr.length);
    const checkedMap = state.checkedTopics[currentSubject.id] || {};
    const checkedCount = Object.keys(checkedMap).length;
    const progressPct = totalTopics > 0 ? Math.round((checkedCount / totalTopics) * 100) : 0;

    const headerCard = document.createElement('div');
    headerCard.className = 'unit-syllabus-progress-card glass-panel';
    headerCard.innerHTML = `
      <div class="subj-card-progress" style="margin-bottom: 20px;">
        <div class="progress-label-row">
          <strong style="font-size:16px;">Syllabus Completion Coverage</strong>
          <strong style="font-size:16px;">${progressPct}%</strong>
        </div>
        <div class="progress-bar-track" style="height: 14px; margin-top:8px;">
          <div class="progress-bar-fill" style="width: ${progressPct}%"></div>
        </div>
        <div class="progress-label-row" style="margin-top: 8px;">
          <span>Completed: ${checkedCount} Topics</span>
          <span>Remaining: ${totalTopics - checkedCount} Topics</span>
        </div>
      </div>
      ${currentSubject.books ? `
      <div class="syllabus-ref-books" style="margin-top: 16px; padding-top: 12px; border-top: 1px dashed var(--glass-border);">
        <strong style="display: block; font-size: 13px; margin-bottom: 4px; color: var(--color-primary);">Reference Books & Resources:</strong>
        <p style="font-size: 13px; color: var(--text-muted); white-space: pre-line; line-height: 1.4; margin: 0;">${currentSubject.books}</p>
      </div>
      ` : ''}
    `;
    container.appendChild(headerCard);

    for (let u = 1; u <= currentSubject.totalUnits; u++) {
      const unitTopics = syllabus[u] || [];
      let unitCheckedCount = 0;
      unitTopics.forEach(t => {
        if (checkedMap[`${u}:${t}`]) unitCheckedCount++;
      });
      const unitPct = unitTopics.length > 0 ? Math.round((unitCheckedCount / unitTopics.length) * 100) : 0;
      const unitName = (currentSubject.unitNames || {})[u] || '';

      const unitCard = document.createElement('div');
      unitCard.className = 'unit-syllabus-progress-card glass-panel';
      unitCard.innerHTML = `
        <div class="unit-title-row">
          <h4>Unit ${u}${unitName ? ': ' + unitName : ''}</h4>
          <span class="unit-progress-badge">${unitPct}% Completed (${unitCheckedCount}/${unitTopics.length})</span>
        </div>
        <div class="topics-checklist">
          ${unitTopics.length === 0 
            ? `<p class="help-text">No topics defined for Unit ${u}. Click 'Edit Subject' to configure.</p>`
            : unitTopics.map((topicName) => {
                const topicKey = `${u}:${topicName}`;
                const isChecked = !!checkedMap[topicKey];
                return `
                  <div class="topic-check-item ${isChecked ? 'checked' : ''}">
                    <div class="topic-checkbox ${isChecked ? 'checked' : ''}" onclick="toggleTopicState('${currentSubject.id}', ${u}, '${topicName.replace(/'/g, "\\'")}')">
                      ${isChecked ? `<svg class="btn-icon" style="width: 12px; height:12px;"><use href="#icon-check"></use></svg>` : ''}
                    </div>
                    <span class="topic-name-label">${topicName}</span>
                  </div>
                `;
              }).join('')
          }
        </div>
      `;
      container.appendChild(unitCard);
    }
  }
}

function toggleTopicState(subjectId, unit, topicName) {
  if (!state.checkedTopics[subjectId]) state.checkedTopics[subjectId] = {};
  const key = `${unit}:${topicName}`;
  if (state.checkedTopics[subjectId][key]) {
    delete state.checkedTopics[subjectId][key];
  } else {
    state.checkedTopics[subjectId][key] = true;
  }
  saveState();
  renderProgress();
  renderDashboard();
}

// ==========================================================================
// 12. BACKUP & SETTINGS VIEW CONTROLLERS
// ==========================================================================
function renderSettings() {}

function formatFriendlyDate(dateStr) {
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-US', options);
}
// MONTH_NAMES moved to global scope at the top of app.js

function backupData() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
  const link = document.createElement("a");
  link.setAttribute("href", dataStr);
  link.setAttribute("download", `ERP_Academic_Log_Backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('ERP data backup downloaded');
}

function restoreData(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const parsed = JSON.parse(evt.target.result);
      if (parsed.subjects && parsed.logs) {
        state = {
          subjects: parsed.subjects || [],
          logs: parsed.logs || [],
          students: parsed.students || [],
          timetable: parsed.timetable || {},
          checkedTopics: parsed.checkedTopics || {},
          academicEvents: parsed.academicEvents || {},
          theme: parsed.theme || 'dark-mode'
        };
        saveState();
        applyTheme();
        showToast('ERP database restored successfully!');
        window.location.hash = 'dashboard';
        navigate('dashboard');
      } else {
        showToast('Invalid ERP backup file structure.', 'danger');
      }
    } catch (err) {
      showToast('Error parsing file JSON.', 'danger');
    }
  };
  reader.readAsText(file);
}

function clearAllData() {
  if (confirm('CRITICAL ACTION: Reset the entire ERP system? This deletes ALL student rosters, subjects, timetables, logs, and events forever.')) {
    state = { subjects: [], logs: [], students: [], timetable: {}, checkedTopics: {}, academicEvents: {}, theme: 'dark-mode' };
    saveState();
    applyTheme();
    showToast('ERP reset completed.', 'danger');
    window.location.hash = 'dashboard';
    navigate('dashboard');
  }
}
