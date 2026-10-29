document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initAnalyticsWidget();
  initProjectFilter();
  initProjectModals();
  initClipboardActions();
  initContactForm();
  initScrollSpy();
});

/* ==========================================================================
   THEME TOGGLING (DARK / LIGHT)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', targetTheme);
      localStorage.setItem('theme', targetTheme);
      updateThemeIcon(targetTheme);

      // Re-render chart to adjust colors for theme
      if (window.analyticsChartInstance) {
        updateChartTheme(targetTheme);
      }
    });
  }
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('theme-toggle-btn');
  if (!btn) return;
  if (theme === 'light') {
    // Sun icon
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    btn.setAttribute('aria-label', 'Switch to dark mode');
  } else {
    // Moon icon
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    btn.setAttribute('aria-label', 'Switch to light mode');
  }
}

/* ==========================================================================
   MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const expanded = navMenu.classList.contains('active');
      toggleBtn.setAttribute('aria-expanded', expanded);
    });

    // Close mobile nav when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
}

/* ==========================================================================
   INTERACTIVE LIVE ANALYTICS CHART (HERO WIDGET)
   ========================================================================== */
const chartDatasets = {
  roas: {
    title: 'Spend vs Revenue ($K)',
    labels: ['Camp A', 'Camp B', 'Camp C', 'Camp D', 'Camp E', 'Camp F'],
    datasets: [
      {
        label: 'Ad Spend ($K)',
        data: [4.2, 8.5, 3.1, 12.0, 6.4, 5.2],
        backgroundColor: 'rgba(56, 189, 248, 0.4)',
        borderColor: '#38bdf8',
        borderWidth: 2,
        borderRadius: 4
      },
      {
        label: 'Generated Revenue ($K)',
        data: [15.8, 29.4, 11.2, 43.8, 21.0, 18.5],
        backgroundColor: 'rgba(16, 185, 129, 0.4)',
        borderColor: '#10b981',
        borderWidth: 2,
        borderRadius: 4
      }
    ],
    kpis: {
      kpi1: { label: 'Avg ROAS', val: '3.62x', trend: '+18.4%', dir: 'up' },
      kpi2: { label: 'Total Revenue', val: '$139.7K', trend: '+24.1%', dir: 'up' },
      kpi3: { label: 'Total Spend', val: '$39.4K', trend: '-5.2%', dir: 'up' }
    }
  },
  conversions: {
    title: 'Campaign Conversions & Clicks',
    labels: ['Camp A', 'Camp B', 'Camp C', 'Camp D', 'Camp E', 'Camp F'],
    datasets: [
      {
        type: 'line',
        label: 'Conversions',
        data: [180, 420, 140, 650, 310, 240],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        tension: 0.35,
        fill: true,
        yAxisID: 'y'
      },
      {
        type: 'bar',
        label: 'Total Clicks (x10)',
        data: [320, 780, 290, 1150, 540, 410],
        backgroundColor: 'rgba(99, 102, 241, 0.4)',
        borderColor: '#6366f1',
        borderWidth: 1,
        borderRadius: 4,
        yAxisID: 'y'
      }
    ],
    kpis: {
      kpi1: { label: 'Total Conversions', val: '1,940', trend: '+15.6%', dir: 'up' },
      kpi2: { label: 'Avg Conv. Rate', val: '5.56%', trend: '+0.8%', dir: 'up' },
      kpi3: { label: 'Total Clicks', val: '34.9K', trend: '+11.2%', dir: 'up' }
    }
  },
  efficiency: {
    title: 'Cost Efficiency (CPA & CPC)',
    labels: ['Camp A', 'Camp B', 'Camp C', 'Camp D', 'Camp E', 'Camp F'],
    datasets: [
      {
        type: 'line',
        label: 'Cost Per Acquisition ($)',
        data: [23.3, 20.2, 22.1, 18.4, 20.6, 21.6],
        borderColor: '#38bdf8',
        backgroundColor: 'transparent',
        borderWidth: 3,
        tension: 0.3
      },
      {
        type: 'line',
        label: 'Cost Per Click ($)',
        data: [1.31, 1.08, 1.06, 1.04, 1.18, 1.26],
        borderColor: '#ec4899',
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.3,
        borderDash: [5, 5]
      }
    ],
    kpis: {
      kpi1: { label: 'Lowest CPA', val: '$18.40', trend: '-14.2%', dir: 'up' },
      kpi2: { label: 'Avg CPC', val: '$1.15', trend: '-8.3%', dir: 'up' },
      kpi3: { label: 'Efficiency Gain', val: '+21.5%', trend: 'Optimized', dir: 'up' }
    }
  }
};

function initAnalyticsWidget(retries = 6) {
  const ctx = document.getElementById('heroAnalyticsChart');
  if (!ctx) return;

  if (typeof Chart === 'undefined') {
    if (retries > 0) {
      setTimeout(() => initAnalyticsWidget(retries - 1), 250);
      return;
    }
    renderChartFallback();
    return;
  }

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const textColor = currentTheme === 'dark' ? '#94a3b8' : '#475569';
  const gridColor = currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

  const chartConfig = {
    type: 'bar',
    data: {
      labels: chartDatasets.roas.labels,
      datasets: chartDatasets.roas.datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: textColor,
            font: { size: 11, family: 'Inter' },
            boxWidth: 12
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleFont: { family: 'Inter', size: 12 },
          bodyFont: { family: 'JetBrains Mono', size: 12 },
          padding: 10,
          cornerRadius: 6,
          borderColor: 'rgba(56, 189, 248, 0.3)',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          ticks: { color: textColor, font: { size: 10 } },
          grid: { display: false }
        },
        y: {
          ticks: { color: textColor, font: { size: 10 } },
          grid: { color: gridColor }
        }
      }
    }
  };

  window.analyticsChartInstance = new Chart(ctx, chartConfig);

  // Bind Pill Tabs
  const pills = document.querySelectorAll('.widget-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      pills.forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');

      const metric = e.target.getAttribute('data-metric');
      switchChartMetric(metric);
    });
  });
}

function switchChartMetric(metricKey) {
  const chart = window.analyticsChartInstance;
  const dataConfig = chartDatasets[metricKey];
  if (!chart || !dataConfig) return;

  chart.data.labels = dataConfig.labels;
  chart.data.datasets = dataConfig.datasets;
  chart.update();

  // Update Mini KPIs
  const kpiData = dataConfig.kpis;
  const kpiBar = document.getElementById('widget-kpi-container');
  if (kpiBar) {
    kpiBar.innerHTML = `
      <div class="mini-kpi">
        <span class="mini-kpi-label">${kpiData.kpi1.label}</span>
        <div class="mini-kpi-val">${kpiData.kpi1.val}</div>
        <span class="mini-kpi-trend trend-${kpiData.kpi1.dir}">${kpiData.kpi1.trend}</span>
      </div>
      <div class="mini-kpi">
        <span class="mini-kpi-label">${kpiData.kpi2.label}</span>
        <div class="mini-kpi-val">${kpiData.kpi2.val}</div>
        <span class="mini-kpi-trend trend-${kpiData.kpi2.dir}">${kpiData.kpi2.trend}</span>
      </div>
      <div class="mini-kpi">
        <span class="mini-kpi-label">${kpiData.kpi3.label}</span>
        <div class="mini-kpi-val">${kpiData.kpi3.val}</div>
        <span class="mini-kpi-trend trend-${kpiData.kpi3.dir}">${kpiData.kpi3.trend}</span>
      </div>
    `;
  }
}

function updateChartTheme(theme) {
  const chart = window.analyticsChartInstance;
  if (!chart) return;
  const textColor = theme === 'dark' ? '#94a3b8' : '#475569';
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

  chart.options.plugins.legend.labels.color = textColor;
  chart.options.scales.x.ticks.color = textColor;
  chart.options.scales.y.ticks.color = textColor;
  chart.options.scales.y.grid.color = gridColor;
  chart.update();
}

function renderChartFallback() {
  const wrapper = document.querySelector('.chart-wrapper');
  if (!wrapper) return;
  wrapper.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; text-align:center; padding:1rem; border:1px dashed var(--border-color); border-radius:var(--radius-sm); background:rgba(255,255,255,0.02);">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--accent-blue); margin-bottom:0.5rem;"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
      <div style="font-weight:600; font-size:0.95rem;">Interactive Campaign Model Active</div>
      <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.25rem;">ROAS: 3.62x • Total Revenue: $139.7K • CPA: $18.40</div>
    </div>
  `;
}

/* ==========================================================================
   PROJECT CATEGORY FILTER
   ========================================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter || category.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   PROJECT CASE STUDY MODALS
   ========================================================================== */
const projectCaseStudies = {
  googleads: {
    title: "GoogleAds Performance Analysis & Dashboard",
    category: "Power BI • DAX • Advanced Excel",
    summary: "Comprehensive multi-channel advertising performance analysis evaluating spend, clicks, conversions, CTR, CPC, CPA, and revenue attribution across global campaigns.",
    challenge: "Marketing leadership lacked cross-campaign visibility into ad spend efficiency, leading to budget waste on high CPA/low-conversion demographics and unoptimized keyword bidding.",
    solution: "Built a robust data model in Power BI with star schema relationships. Integrated historical campaign logs, cleaned tracking errors in Excel/Power Query, and developed dynamic DAX measures for real-time KPI tracking.",
    daxCode: `// 1. Click-Through Rate (CTR)
CTR % = DIVIDE(SUM(GoogleAds[Clicks]), SUM(GoogleAds[Impressions]), 0)

// 2. Cost Per Acquisition (CPA)
CPA = DIVIDE(SUM(GoogleAds[Cost]), SUM(GoogleAds[Conversions]), 0)

// 3. Return on Ad Spend (ROAS)
ROAS = DIVIDE(SUM(GoogleAds[Revenue]), SUM(GoogleAds[Cost]), 0)

// 4. Dynamic Campaign Rating
Campaign Efficiency = 
IF([ROAS] >= 3.5 && [CPA] <= 22, "Top Tier", 
   IF([ROAS] >= 2.0, "Moderate", "Needs Optimization"))`,
    insights: [
      "Identified that 22% of campaigns generated 71% of total conversions, highlighting severe budget misallocation.",
      "Calculated CPA variance across geographic regions, revealing Tier-2 cities converted at 34% lower CPA than saturated metropolitan markets.",
      "Proposed strategic reallocation that projected a 24.5% boost in quarterly ROAS without increasing overall ad spend."
    ]
  },
  crime: {
    title: "Crime & Theft Pattern Analysis Dashboard",
    category: "Power BI • Geospatial • Time Series Analysis",
    summary: "Interactive operational intelligence dashboard engineered to uncover vehicle theft patterns, hotspot zones, and temporal frequency distributions.",
    challenge: "Law enforcement and fleet operations faced delayed manual reporting that masked underlying geographical patterns and vehicle-specific vulnerabilities.",
    solution: "Designed an interactive Power BI dashboard featuring synchronized spatial mapping, temporal slicers (Day of Week, Hour of Day), and make/model categorization.",
    daxCode: `// Temporal Incident Density
Incident Density = 
CALCULATE(
    COUNT(TheftReports[Incident_ID]),
    ALLEXCEPT(TheftReports, TheftReports[Region], TheftReports[Vehicle_Type])
)

// Peak Risk Classification
Risk Level = 
SWITCH(
    TRUE(),
    [Incident Density] > 250, "Critical Hotspot",
    [Incident Density] > 100, "Moderate Risk",
    "Low Risk"
)`,
    insights: [
      "Pinpointed recurring theft surges between 10:00 PM and 3:30 AM concentrated in transit-adjacent commercial parking lots.",
      "Determined that two specific vehicle makes constituted over 43% of total incidents, driven by identifiable keyless-entry vulnerability points.",
      "Empowered stakeholders to dynamically simulate patrol coverage adjustments using interactive region and date filters."
    ]
  },
  netflix: {
    title: "Netflix Global Content & Streaming Trends",
    category: "Python • Pandas • Matplotlib • NumPy",
    summary: "In-depth Exploratory Data Analysis (EDA) on Netflix's worldwide streaming catalog, analyzing genre evolution, country production networks, and content lifecycles.",
    challenge: "Understanding competitive platform strategy shifts, transitioning from third-party movie licensing to proprietary original TV series.",
    solution: "Engineered Python pipeline utilizing Pandas for data wrangling, missing-value imputation, date extraction, and string vectorization; visualized trends with Matplotlib and Seaborn.",
    daxCode: `# Python EDA Pipeline Snippet
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv('netflix_titles.csv')
df['date_added'] = pd.to_datetime(df['date_added'].str.strip())
df['year_added'] = df['date_added'].dt.year

# Analyze TV Show vs Movie composition over time
pivot_content = df.groupby(['year_added', 'type']).size().unstack(fill_value=0)
pivot_content.plot(kind='bar', stacked=True, color=['#e50914', '#221f1f'])
plt.title("Evolution of Netflix Catalog: Movies vs TV Series")
plt.xlabel("Year Added")
plt.ylabel("Count")
plt.show()`,
    insights: [
      "Demonstrated that starting in 2016, TV show additions accelerated by 210%, signaling a deliberate corporate shift toward episodic retention.",
      "Identified United States, India, and United Kingdom as the top 3 content producers, with international content growing 4x faster since 2019.",
      "Uncovered that TV-MA and TV-14 ratings account for more than 70% of total catalog distribution."
    ]
  }
};

function initProjectModals() {
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const detailBtns = document.querySelectorAll('.open-case-study');

  if (!modalOverlay) return;

  detailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      const data = projectCaseStudies[projectId];
      if (!data) return;

      populateModal(data);
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

function populateModal(data) {
  const titleEl = document.getElementById('modal-project-title');
  const catEl = document.getElementById('modal-project-category');
  const summaryEl = document.getElementById('modal-project-summary');
  const challengeEl = document.getElementById('modal-project-challenge');
  const solutionEl = document.getElementById('modal-project-solution');
  const codeEl = document.getElementById('modal-project-code');
  const insightsListEl = document.getElementById('modal-project-insights');

  if (titleEl) titleEl.textContent = data.title;
  if (catEl) catEl.textContent = data.category;
  if (summaryEl) summaryEl.textContent = data.summary;
  if (challengeEl) challengeEl.textContent = data.challenge;
  if (solutionEl) solutionEl.textContent = data.solution;
  if (codeEl) codeEl.textContent = data.daxCode;

  if (insightsListEl) {
    insightsListEl.innerHTML = '';
    data.insights.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${item}</span>
      `;
      insightsListEl.appendChild(li);
    });
  }
}

/* ==========================================================================
   CLIPBOARD & TOAST SYSTEM
   ========================================================================== */
function initClipboardActions() {
  const copyBtns = document.querySelectorAll('.copy-trigger');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied "${textToCopy}" to clipboard!`);
      }).catch(() => {
        showToast('Unable to copy text.');
      });
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ==========================================================================
   CONTACT FORM SUBMISSION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const WEBSITE_URL = 'https://crunzy.in';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = form.querySelector('[name="name"]');
    const emailInput = form.querySelector('[name="email"]');
    const messageInput = form.querySelector('[name="message"]');
    const submitBtn = form.querySelector('button[type="submit"]');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      showToast('Please complete all required fields.');
      return;
    }

    const originalBtnText = submitBtn ? submitBtn.innerText : 'Send';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Sending...';
    }

    const fullMessage = `${message}\n\nSent via Portfolio: ${WEBSITE_URL}`;

    // Option A: EmailJS Direct Browser Delivery
    if (typeof emailjs !== 'undefined') {
      try {
        await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
          from_name: name,
          from_email: email,
          message: message,
          website_url: WEBSITE_URL
        });
        showToast('Message sent successfully! Arun will reach back out soon.');
        form.reset();
      } catch (err) {
        showToast('Failed to deliver message via EmailJS. Please try again.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalBtnText;
        }
      }
      return;
    }

    // Option B: Endpoint Fallback (Formspree / Custom API)
    const endpoint = form.getAttribute('action');
    if (endpoint && endpoint !== '#' && !endpoint.startsWith('mailto:')) {
      try {
        const formData = new FormData(form);
        formData.append('website_source', WEBSITE_URL);

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          showToast('Message sent successfully!');
          form.reset();
        } else {
          showToast('Delivery failed. Please check form settings.');
        }
      } catch (err) {
        showToast('Network error while attempting to send message.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalBtnText;
        }
      }
      return;
    }

    // Option C: Mailto Fallback
    const mailtoUri = `mailto:sharmaaarun678@gmail.com?subject=Data%20Analyst%20Inquiry%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(fullMessage)}%0A%0AReply%20to:%20${encodeURIComponent(email)}`;
    window.location.href = mailtoUri;
    showToast('Opening local mail client...');

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerText = originalBtnText;
    }
  });
}

/* ==========================================================================
   SCROLL SPY FOR ACTIVE NAVIGATION
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}