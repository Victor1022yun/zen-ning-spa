  // ── Mobile menu ──────────────────────────
  document.getElementById('ham-btn').addEventListener('click', () => {
    document.getElementById('mob-menu').classList.toggle('open');
  });
  function closeMob() { document.getElementById('mob-menu').classList.remove('open'); }


  // ── Language toggle ─────────────────────
  function toggleLang() {
    const html = document.documentElement;
    const goZh = html.lang === 'en';
    html.lang = goZh ? 'zh-CN' : 'en';
    const lbl = goZh ? 'EN' : '中文';
    ['lang-label','lang-label-mob'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = lbl;
    });
    // Update form placeholders
    const isEn = !goZh;
    const phs = {
      'f-name':  [isEn ? 'Your name' : '您的姓名', 'placeholder'],
      'f-notes': [isEn
        ? 'Special requests (pressure preference, health notes, etc.)…'
        : '如有特别要求（力度偏好、身体状况等），请在此说明…', 'placeholder'],
    };
    Object.entries(phs).forEach(([id, [val]]) => {
      const el = document.getElementById(id);
      if (el) el.placeholder = val;
    });
    // Update service select options
    const svc = document.getElementById('f-service');
    if (svc) {
      const opts = isEn
        ? ['Please select a service','Traditional Thai Massage (60/90/120 min)',
           'Aromatherapy Oil SPA (60/90/120 min)','Reflexology Foot Therapy (45/60/90 min)',
           'Hot Stone Massage','Couple Package','Other (describe in notes)']
        : ['请选择服务','泰式古法按摩 (60 / 90 / 120 分)',
           '精油芳香 SPA (60 / 90 / 120 分)','足底反射理疗 (45 / 60 / 90 分)',
           '热石按摩疗法','情侣套餐','其他（请在留言说明）'];
      [...svc.options].forEach((opt, i) => { if (opts[i]) opt.text = opts[i]; });
    }
    // Update region select: placeholder + optgroup labels
    const reg = document.getElementById('f-region');
    if (reg) {
      const ph = reg.querySelector('option[disabled]');
      if (ph) ph.text = isEn ? 'Select your state' : '请选择您所在的州属';
      reg.querySelectorAll('optgroup[data-label-en]').forEach(og => {
        og.label = isEn ? og.dataset.labelEn : og.dataset.labelZh;
      });
    }
    // Update persons select
    const pax = document.getElementById('f-persons');
    if (pax) {
      const labels = isEn ? ['1 Pax','2 Pax','3 Pax','4+ Pax'] : ['1 人','2 人','3 人','4+ 人'];
      [...pax.options].forEach((opt, i) => { if (labels[i]) opt.text = labels[i]; });
    }
    // Update submit button (if not in submitting state)
    const sbtn = document.getElementById('submit-btn');
    if (sbtn && !sbtn.disabled) {
      sbtn.innerHTML = isEn
        ? '<i class="fa-brands fa-telegram text-base mr-2"></i>Send via Telegram'
        : '<i class="fa-brands fa-telegram text-base mr-2"></i>Telegram 发送预约';
    }
    // Update branch count
    renderBranchCount();
  }

  // ── Branch filter ────────────────────────
  const REGION_NAMES = {
    kl: ['吉隆坡区', 'KL area'], selangor: ['雪兰莪区', 'Selangor area'], north: ['北马区', 'Northern region'],
    south: ['南马区', 'Southern region'], east: ['东马 / 其他区', 'East Malaysia / Others']
  };
  let curRegion = 'all';
  function renderBranchCount() {
    const countEl = document.getElementById('branch-count');
    const box = document.getElementById('region-locs');
    if (!countEl || !box) return;
    const links = [...document.querySelectorAll('#loc-strip .loc-link[data-loc]')]
      .filter(a => curRegion === 'all' || a.dataset.region === curRegion);
    const rn = REGION_NAMES[curRegion];
    countEl.innerHTML = rn
      ? '<span class="txt-zh"><b class="text-brass-300 font-semibold">' + rn[0] + '</b> · ' + links.length + ' 个服务地点，点击进入分店页面</span><span class="txt-en"><b class="text-brass-300 font-semibold">' + rn[1] + '</b> · ' + links.length + ' locations — tap one to open its branch page</span>'
      : '<span class="txt-zh">全马 <b class="text-brass-300 font-semibold">' + links.length + '</b> 个服务地点，点击进入分店页面</span><span class="txt-en"><b class="text-brass-300 font-semibold">' + links.length + '</b> locations across Malaysia — tap one to open its branch page</span>';
    box.innerHTML = links.map(a => '<a href="/' + a.dataset.loc + '" class="rl-chip"><i class="fa-solid fa-location-dot text-sage-400 text-[.6rem]"></i>' + a.innerHTML + '</a>').join('');
  }
  function markLoc() {
    const strip = document.getElementById('loc-strip');
    const act = strip && strip.querySelector('.loc-active');
    if (act && strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({ left: act.offsetLeft - (strip.clientWidth - act.offsetWidth) / 2, behavior: 'smooth' });
    }
  }
  function viewFirst() {
    const el = document.getElementById('loc-first');
    const hdr = document.getElementById('site-header');
    const off = (hdr ? hdr.offsetHeight : 130) + 16;
    const from = scrollY, to = el.getBoundingClientRect().top + scrollY - off;
    const dur = 1400, ease = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;  // easeInOutCubic
    let t0 = null;
    const step = ts => {
      if (t0 === null) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      window.scrollTo({ top: from + (to - from) * ease(p), behavior: 'instant' });
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ── Branch therapist line-ups ──────────────────────────────────────────
  // Generated from therapists.py so the SPA and the static site always show
  // the same people. 6-8 per branch; the first one is the featured therapist.
  const TEAM = [{"zh":"丘佩玲","en":"Yew Pei Ling","img":47,"years":8,"sz":"泰式古法 · 深层理疗","se":"Traditional Thai · Deep Tissue","hz":"沉稳的力道，找回身体的<span class=\"text-sage-300\">平衡</span>。","he":"Steady pressure that brings<br><span class=\"text-sage-300\">the body back to balance.</span>","cz":"泰国 WAT PO 认证","ce":"WAT PO Thailand Cert.","fz":"🇲🇾 马来西亚","fe":"🇲🇾 Malaysia","tags":[["泰式古法","Traditional Thai"],["深层理疗","Deep Tissue"],["全身调理","Full Body"]]},{"zh":"努鲁爱茵","en":"Nurul Ain","img":23,"years":6,"sz":"精油芳香疗愈 · 淋巴排毒","se":"Aromatherapy · Lymph Detox","hz":"芬香渗透，温柔疗愈的力量。","he":"The quiet power of<br><span class=\"text-sage-300\">scent and touch.</span>","cz":"ITEC 认证芳疗师","ce":"ITEC Certified Aromatherapist","fz":"🇲🇾 马来西亚","fe":"🇲🇾 Malaysia","tags":[["精油芳疗","Aromatherapy"],["淋巴排毒","Lymph Detox"],["全身放松","Full Body Relax"]]},{"zh":"希蒂·拉赫玛","en":"Siti Rahmah","img":33,"years":5,"sz":"热石疗愈 · 深层筋膜","se":"Hot Stone · Deep Fascia","hz":"热石的温度，融化每一处<span class=\"text-sage-300\">紧结与疲惫</span>。","he":"Warmth that melts every<br><span class=\"text-sage-300\">knot and tension.</span>","cz":"Bali BSPA 热石认证","ce":"Bali BSPA Hot Stone Cert.","fz":"🇮🇩 印尼","fe":"🇮🇩 Indonesia","tags":[["热石疗愈","Hot Stone"],["深层筋膜","Deep Fascia"],["脊背舒压","Back Relief"]]},{"zh":"玲 Linh","en":"Linh","img":25,"years":4,"sz":"压穴舒压 · 肩颈放松","se":"Acupoint · Neck & Shoulder","hz":"精准的指尖，指向每一个<span class=\"text-sage-300\">疼痛的根源</span>。","he":"Precise hands that find<br><span class=\"text-sage-300\">the root of every ache.</span>","cz":"越南传统压穴认证","ce":"Vietnamese Acupoint Cert.","fz":"🇻🇳 越南","fe":"🇻🇳 Vietnam","tags":[["压穴舒压","Acupoint"],["肩颈放松","Neck & Shoulder"],["头部舒压","Head Relaxation"]]},{"zh":"可可 Coco","en":"Coco","img":52,"years":7,"sz":"泰式古法 · 脊背舒压","se":"Traditional Thai · Back Relief","hz":"泰式的智慧，传承数千年的<span class=\"text-sage-300\">疗愈艺术</span>。","he":"Ancient wisdom<br>carried in every<span class=\"text-sage-300\"> movement.</span>","cz":"泰国 WAT PO 认证","ce":"WAT PO Thailand Cert.","fz":"🇹🇭 泰国","fe":"🇹🇭 Thailand","tags":[["泰式古法","Traditional Thai"],["脊背舒压","Back Relief"],["跨步伸展","Stretch Therapy"]]},{"zh":"陈美玲","en":"Tan Mei Ling","img":45,"years":6,"sz":"足底反射 · 经络调理","se":"Reflexology · Meridian Therapy","hz":"从足底开始，<span class=\"text-sage-300\">唤醒整个身体</span>。","he":"It starts at the feet and<br><span class=\"text-sage-300\">wakes the whole body.</span>","cz":"中医推拿认证","ce":"TCM Tuina Certified","fz":"🇨🇳 中国","fe":"🇨🇳 China","tags":[["足底反射","Reflexology"],["经络调理","Meridian"],["暖宫驱寒","Warming Therapy"]]},{"zh":"阿妮莎","en":"Anisa","img":32,"years":5,"sz":"孕期按摩 · 产后调理","se":"Prenatal · Postnatal Care","hz":"最轻的手法，给最需要<span class=\"text-sage-300\">呵护的身体</span>。","he":"The gentlest touch for<br><span class=\"text-sage-300\">the body that needs it most.</span>","cz":"CIBTAC 孕产按摩认证","ce":"CIBTAC Prenatal Cert.","fz":"🇮🇩 印尼","fe":"🇮🇩 Indonesia","tags":[["孕期按摩","Prenatal"],["产后调理","Postnatal"],["轻柔舒缓","Gentle Relief"]]},{"zh":"娜塔雅","en":"Nattaya","img":44,"years":9,"sz":"泰式拉伸 · 运动理疗","se":"Thai Stretch · Sports Therapy","hz":"拉开筋骨，让身体<span class=\"text-sage-300\">重新打开</span>。","he":"Stretch deep, and the body<br><span class=\"text-sage-300\">opens up again.</span>","cz":"泰国卫生部注册","ce":"Thai Ministry of Health Reg.","fz":"🇹🇭 泰国","fe":"🇹🇭 Thailand","tags":[["泰式拉伸","Thai Stretch"],["运动理疗","Sports Therapy"],["关节舒展","Joint Mobility"]]},{"zh":"玉莲","en":"Yuk Lian","img":26,"years":7,"sz":"精油热敷 · 肩颈深层","se":"Oil & Heat · Deep Neck","hz":"久坐的肩颈，需要一双<span class=\"text-sage-300\">懂它的手</span>。","he":"Desk-bound shoulders need<br><span class=\"text-sage-300\">hands that understand them.</span>","cz":"IFPA 国际芳疗认证","ce":"IFPA Aromatherapy Cert.","fz":"🇲🇾 马来西亚","fe":"🇲🇾 Malaysia","tags":[["精油热敷","Oil & Heat"],["肩颈深层","Deep Neck"],["办公族舒压","Desk Relief"]]},{"zh":"媚 Mya","en":"Mya","img":20,"years":4,"sz":"缅式古法 · 全身舒缓","se":"Burmese Traditional · Full Body","hz":"慢下来的节奏，<span class=\"text-sage-300\">身体自然松开</span>。","he":"A slower rhythm, and<br><span class=\"text-sage-300\">the body lets go on its own.</span>","cz":"缅甸传统疗法认证","ce":"Burmese Traditional Cert.","fz":"🇲🇲 缅甸","fe":"🇲🇲 Myanmar","tags":[["缅式古法","Burmese"],["全身舒缓","Full Body"],["睡眠改善","Better Sleep"]]}];
  const ROSTERS = {"kuala-lumpur":[9,8,4,1,0,5,6,2],"penang":[0,4,6,5,8,1,9,2],"johor":[1,3,2,9,6,7,4,5],"petaling-jaya":[7,8,0,9,2,5,4,1],"subang":[5,1,8,6,7,3,9,2],"cheras":[1,4,0,6,8,7,5,2],"mont-kiara":[3,7,1,2,8,9,5,4],"ampang":[4,1,5,7,6,0,9],"kepong":[3,1,2,5,4,8,7],"sri-petaling":[7,2,5,0,6,9,3],"puchong":[3,1,2,8,7,9,4],"kota-damansara":[3,7,5,6,1,4,0],"klang":[5,7,1,8,3,4,6],"ipoh":[3,5,4,9,2,1,0],"melaka":[9,4,3,1,7,8,5],"sabah":[0,5,7,3,6,2,8],"langkawi":[5,6,3,4,0,1,8],"genting":[9,2,0,4,1,3,8],"cyberjaya":[2,6,4,1,5,3],"serdang":[1,2,0,3,7,4],"setia-alam":[0,3,7,5,6,9],"taiping":[4,2,0,5,7,1],"port-dickson":[2,0,7,1,4,8],"seremban":[5,6,9,3,7,0],"pahang":[0,1,6,9,2,3],"sarawak":[5,1,7,3,0,6]};
  const TG_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16" class="shrink-0"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>';

  const L = (zh, en) => '<span class="txt-zh">' + zh + '</span><span class="txt-en">' + en + '</span>';

  function portraitHTML(t) {
    return '<img src="https://i.pravatar.cc/600?img=' + t.img + '" alt="' + t.zh + '"'
         + ' class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" loading="lazy">'
         + '<div class="absolute inset-0" style="background:linear-gradient(to bottom,transparent 45%,rgba(18,2,1,.92) 100%)"></div>'
         + '<div class="absolute top-4 left-4"><span class="font-body text-[.6rem] bg-brass-400/30 text-brass-300 px-2.5 py-1 rounded-full border border-brass-400/25">'
         + L(t.years + '年经验', t.years + ' Yrs Exp.') + '</span></div>'
         + '<div class="absolute bottom-0 left-0 right-0 p-5">'
         + '<p class="font-display text-white text-xl font-semibold leading-tight">' + L(t.zh, t.en) + '</p>'
         + '<p class="font-body text-white/55 text-[.7rem] mt-1">' + L(t.sz, t.se) + '</p></div>';
  }

  function therapistRow(t) {
    const pill = (icon, zh, en) =>
      '<span class="inline-flex items-center gap-1.5 font-body text-[.68rem] text-brass-300/80 bg-white/[.06] border border-brass-400/15 px-3 py-1.5 rounded-full">'
      + '<i class="fa-solid ' + icon + ' text-[.55rem] text-sage-400"></i>' + L(zh, en) + '</span>';
    const tag = p =>
      '<span class="font-body text-[.7rem] bg-white/[.08] text-white/60 border border-white/10 px-3 py-1.5 rounded-full">' + L(p[0], p[1]) + '</span>';
    return '<div class="flex flex-col md:flex-row gap-6 md:gap-10 items-stretch">'
      + '<div class="w-full md:w-5/12 flex-shrink-0"><div class="rounded-2xl overflow-hidden relative group aspect-[3/4]">'
      + portraitHTML(t) + '</div></div>'
      + '<div class="w-full md:w-7/12 flex flex-col justify-center py-2 md:py-4">'
      + '<p class="font-display text-[1.3rem] md:text-[1.6rem] font-light text-white/90 leading-snug mb-4">' + L(t.hz, t.he) + '</p>'
      + '<div class="flex flex-wrap gap-2 mb-5">' + pill('fa-certificate', t.cz, t.ce) + pill('fa-flag', t.fz, t.fe) + '</div>'
      + '<div class="flex flex-wrap gap-2">' + t.tags.map(tag).join('') + '</div>'
      + '<div class="mt-5"><a class="tg-book inline-flex items-center gap-2 font-body text-sm font-medium bg-[#27AEDC] hover:bg-[#1a9bc8] text-white px-5 py-2.5 rounded-full transition-colors duration-200"'
      + ' href="https://t.me/ZenNingSPA" target="_blank" rel="noopener" data-zh="' + t.zh + '" data-en="' + t.en + '">'
      + TG_SVG + L('立即预约', 'Book Now!') + '</a></div></div></div>';
  }

  function renderTeam(slug) {
    const idx = ROSTERS[slug];
    if (!idx) return;
    const team = idx.map(i => TEAM[i]), lead = team[0];
    document.getElementById('loc-lead').innerHTML = portraitHTML(lead);
    const b = document.getElementById('loc-lead-book');
    b.dataset.zh = lead.zh; b.dataset.en = lead.en;
    document.getElementById('loc-count').innerHTML =
      L('本店共有 <b class="text-brass-300">' + team.length + '</b> 位认证理疗师为您服务',
        '<b class="text-brass-300">' + team.length + '</b> certified therapists at this branch');
    document.getElementById('loc-team').innerHTML = team.slice(1).map(therapistRow).join('');
  }


  function filterBranches(region) {
    const cards = document.querySelectorAll('.branch-card');
    let count = 0;
    cards.forEach(card => {
      const match = region === 'all' || card.dataset.region === region;
      card.classList.toggle('card-hidden', !match);
      if (match) count++;
    });
    curRegion = region;
    renderBranchCount();
    markLoc();
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.classList.toggle('tab-active', tab.dataset.filter === region);
    });
  }

  function triggerReveals(container) {
    if (!container) return;
    // Reset
    container.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('in');
    });
    // Add `in` respecting each element's existing transition-delay
    setTimeout(() => {
      container.querySelectorAll('.reveal').forEach(el => {
        const delay = parseFloat(el.style.transitionDelay || '0') * 1000;
        setTimeout(() => el.classList.add('in'), delay);
      });
    }, 80);
  }

  // ── Init on load ─────────────────────────
  window.addEventListener('load', () => {
    // Apply EN language state to dynamic elements (HTML starts as lang="en")
    const isEn = document.documentElement.lang === 'en';
    if (isEn) {
      const reg = document.getElementById('f-region');
      if (reg) {
        const ph = reg.querySelector('option[disabled]');
        if (ph) ph.text = 'Select your state';
        reg.querySelectorAll('optgroup[data-label-en]').forEach(og => { og.label = og.dataset.labelEn; });
      }
      const pax = document.getElementById('f-persons');
      if (pax) {
        ['1 Pax','2 Pax','3 Pax','4+ Pax'].forEach((t,i) => { if(pax.options[i]) pax.options[i].text = t; });
      }
      const svc = document.getElementById('f-service');
      if (svc) {
        ['Please select a service','Traditional Thai Massage (60/90/120 min)',
         'Aromatherapy Oil SPA (60/90/120 min)','Reflexology Foot Therapy (45/60/90 min)',
         'Hot Stone Massage','Couple Package','Other (describe in notes)'].forEach((t,i) => {
           if(svc.options[i]) svc.options[i].text = t;
         });
      }
      const sbtn = document.getElementById('submit-btn');
      if (sbtn) sbtn.innerHTML = '<i class="fa-brands fa-telegram text-base mr-2"></i>Send via Telegram';
      const fname = document.getElementById('f-name');
      if (fname) fname.placeholder = 'Your name';
      const fnotes = document.getElementById('f-notes');
      if (fnotes) fnotes.placeholder = 'Special requests (pressure preference, health notes, etc.)…';
    }
    const page = document.querySelector('.page');
    if (document.getElementById('find')) filterBranches('all');
    markLoc();
    triggerReveals(page);
  });

  // ── Booking form → Telegram ───────────────
  function handleSubmit(btn) {
    const name    = document.getElementById('f-name').value.trim();
    const region  = document.getElementById('f-region').value;
    const service = document.getElementById('f-service').value;
    const date    = document.getElementById('f-date').value;
    const persons = document.getElementById('f-persons').value;
    const notes   = document.getElementById('f-notes').value.trim();

    const errBox = document.getElementById('f-error');
    const errMsg = document.getElementById('f-error-msg');

    function markField(id, bad) {
      const el = document.getElementById(id);
      if (el) el.style.borderColor = bad ? '#ef4444' : '';
    }

    // Validate — region is now required
    const missing = [];
    markField('f-name',    !name);    if (!name)    missing.push('姓名');
    markField('f-region',  !region);  if (!region)  missing.push('所在州属');
    markField('f-service', !service); if (!service) missing.push('服务项目');
    markField('f-date',    !date);    if (!date)    missing.push('预约日期');

    if (missing.length > 0) {
      const isEnNow = document.documentElement.lang === 'en';
      errMsg.textContent = isEnNow
        ? 'Please complete: ' + missing.map(m => ({
            '姓名':'Name','所在州属':'State','服务项目':'Service','预约日期':'Date'
          }[m] || m)).join(', ')
        : '请填写必填项：' + missing.join('、');
      errBox.classList.remove('hidden');
      errBox.classList.add('flex');
      return;
    }

    errBox.classList.add('hidden');
    errBox.classList.remove('flex');

    // Format date YYYY-MM-DD → YYYY年MM月DD日
    const [y, m, d] = date.split('-');
    const dateStr = `${y}年${m}月${d}日`;

    // Build the Telegram message — region appears first so boss sees it immediately
    const lines = [
      '您好！我想透过网站预约按摩服务 🌿',
      '',
      `📍 我来自：${region}`,
      `👤 姓名：${name}`,
      `💆 服务项目：${service}`,
      `📅 预约日期：${dateStr}`,
      `👥 人数：${persons}`,
    ];
    if (notes) lines.push(`📝 备注：${notes}`);
    lines.push('', '请确认预约，谢谢！🙏');

    const message = lines.join('\n');
    const tgUsername = 'ZenNingSPA'; // ← 替换为您的 Telegram 用户名（@xxx）
    const tgURL = 'tg://msg?to=@' + tgUsername + '&text=' + encodeURIComponent(message);

    // Visual feedback on button
    btn.disabled = true;
    btn.innerHTML = document.documentElement.lang === 'en' ? '<i class="fa-solid fa-check mr-2"></i>Opening Telegram…' : '<i class="fa-solid fa-check mr-2"></i>正在开启 Telegram…';
    btn.classList.replace('bg-sage-500', 'bg-green-700');
    btn.classList.replace('hover:bg-sage-600', 'hover:bg-green-700');

    // Open Telegram
    window.open(tgURL, '_blank');

    // Reset button after delay
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = document.documentElement.lang === 'en' ? '<i class="fa-brands fa-telegram text-base mr-2"></i>Send via Telegram' : '<i class="fa-brands fa-telegram text-base mr-2"></i>Telegram 发送预约';
      btn.classList.replace('bg-green-700', 'bg-sage-500');
      btn.classList.replace('hover:bg-green-700', 'hover:bg-sage-600');
    }, 3500);
  }

  // Clear red border on input focus
  ['f-name','f-region','f-service','f-date'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => { el.style.borderColor = ''; });
    if (el) el.addEventListener('change', () => { el.style.borderColor = ''; });
  });