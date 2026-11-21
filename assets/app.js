/* 长沙漫游 · 交互组件库（移动动画 / 自适应模态弹窗 / 选项卡 / 时间线） */
(function () {
  'use strict';

  /* ---------- 页面载入淡入 ---------- */
  document.body.classList.add('preload');
  window.addEventListener('load', function () {
    requestAnimationFrame(function () {
      document.body.classList.remove('preload');
      document.body.classList.add('page-loaded');
    });
  });

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 滚动显现（Inter动画） ---------- */
  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('is-visible');
        revealIO.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { revealIO.observe(el); });

  /* ============================================================
     数据
     ============================================================ */
  var SPOTS = {
    'chaozong':  { name: '潮宗街', en: 'CHAOZONG ST.', tag: '麻石老街 · 买手店', desc: '长沙保存最完整的麻石老街之一，百年教堂、老公馆与新潮买手店共生。转角的红砖墙是本地摄影师最爱的取景框，下午四点光线最好。' },
    'xiyuan':    { name: '西园北里', en: 'XIYUAN BEILI', tag: '民国公馆 · 咖啡', desc: '一条不足六百米的巷子，藏着十余栋民国老公馆。梧桐树影里开着手冲咖啡与旧书店，适合把脚步放到最慢。' },
    'hualong':   { name: '化龙池', en: 'HUALONGCHI', tag: '清吧 · 民谣现场', desc: '白天是安静的石板老巷，入夜霓虹亮起，清吧与民谣驻唱接力开场。想听长沙人唱自己的歌，来这里。' },
    'xiezilong': { name: '谢子龙影像艺术馆', en: 'XPM', tag: '影像展 · 清水混凝土', desc: '湘江西岸的白色清水混凝土建筑，本身就是一件展品。常年有国内外影像展，馆外的几何光影随手拍都是大片。' },
    'duzheng':   { name: '都正街', en: 'DUZHENG ST.', tag: '本地过早 · 老巷子', desc: '本地人“过早”的老街：肉丝粉、甜酒冲蛋、糖油粑粑一路吃过去。没有游客队，只有长沙的日常。' },
    'lizijian':  { name: '李自健美术馆', en: 'LI ZIJIAN MUSEUM', tag: '油画 · 免费常设展', desc: '湘江边的油画殿堂，常设展免费开放。馆外的天鹅湖与草地，是看落日余晖的安静角落。' },
    'houhu':     { name: '后湖国际艺术区', en: 'HOUHU ART ZONE', tag: '老厂房 · 市集', desc: '大学城旁的老厂房改造艺术区，工作室、独立展厅与周末市集轮番上演。黄昏时分湖面泛金，最温柔。' },
    'tongguan':  { name: '铜官窑古镇', en: 'TONGGUAN KILN', tag: '千年窑火 · 手作', desc: '“黑石号”沉船瓷器的故乡，千年窑火未熄。可以亲手拉坯做一只陶碗，把长沙的记忆带回家。' }
  };

  var FOODS = {
    'tofu':     { name: '臭豆腐', en: 'STINKY TOFU', img: 'assets/tofu.jpg', price: '¥15', place: '黑色经典 · 坡子街', desc: '外脆里嫩的黑色小方块，浇一勺红亮剁椒与蒜汁。闻着皱眉，吃着上瘾——这是长沙递给每个人的第一份见面礼。' },
    'milktea':  { name: '茶颜悦色', en: 'SEXYTEA', img: 'assets/milktea.jpg', price: '¥18', place: '幽兰拿铁 · 盲点不踩雷', desc: '长沙土生土长的中式茶饮，忌廉雪顶撒碧根果碎，茶香清而不腻。五一商圈排队太长？往巷子里走五十米就有下一家。' },
    'crayfish': { name: '口味虾', en: 'SPICY CRAYFISH', img: 'assets/crayfish.jpg', price: '¥90', place: '文和友 · 海信广场店', desc: '夏夜的长沙属于口味虾：红亮虾壳裹满辣椒与紫苏，配一杯冰啤酒，辣得酣畅淋漓，是这座城市的深夜仪式。' },
    'tangyou':  { name: '糖油粑粑', en: 'SWEET RICE CAKE', img: 'assets/tangyou.jpg', price: '¥10', place: '火宫殿 · 坡子街总店', desc: '糯米团子在红糖油锅里滚到金黄，外裹焦糖脆壳、内里软糯拉丝。三块钱一个的甜，是长沙人从小吃到大的温柔。' }
  };

  var STOPS = {
    'taiping': { name: '太平老街', en: 'TAIPING OLD ST.', img: 'assets/old-street.jpg', time: '09:00', desc: '从一碗肉丝粉开始。青石板路、贾谊故居与百年老店并排而立，清晨的老街最有烟火气。', tip: '建议 1.5 小时 · 贾谊故居需预约' },
    'pozi':    { name: '坡子街', en: 'POZI ST.', img: 'assets/snack-tea.jpg', time: '11:30', desc: '火宫殿的臭豆腐、糖油粑粑都在这条街上。午饭就在这里解决，记得留一点肚子给奶茶。', tip: '建议 1.5 小时 · 人均 ¥50 吃到撑' },
    'yuelu':   { name: '岳麓书院', en: 'YUELU ACADEMY', img: 'assets/academy.jpg', time: '14:00', desc: '千年学府，弦歌不绝。在古树与碑刻之间坐一会儿，出来顺路登岳麓山，看爱晚亭的秋色。', tip: '建议 2 小时 · 周一闭馆，需预约' },
    'juzizhou':{ name: '橘子洲头', en: 'ORANGE ISLE', img: 'assets/hero-sunset.jpg', time: '17:00', desc: '湘江中心的绿色长岛。傍晚沿江走到洲头，看夕阳落进岳麓山后，一江两岸渐次亮灯。', tip: '建议 2 小时 · 观光小火车往返' },
    'bar':     { name: '化龙池酒吧街', en: 'HUALONGCHI NIGHT', img: 'assets/hero-wide.jpg', time: '20:00', desc: '老巷入夜，民谣与霓虹刚刚开场。找一家有驻唱的清吧坐下，为这一天收尾。', tip: '建议 2 小时 · 民谣演出 21:00 后' }
  };

  /* ============================================================
     自适应模态弹窗
     ============================================================ */
  var modal = document.getElementById('modal');
  var lastFocus = null;

  function openModal(html) {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.querySelector('.modal-body').innerHTML = html;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { modal.classList.add('open'); });
    modal.querySelector('.modal-close').focus();
  }
  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () { modal.hidden = true; }, 340);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-close')) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });
  }

  function kicker(en) { return '<p class="modal-kicker">' + en + '</p>'; }

  function spotHTML(s) {
    return kicker(s.en) +
      '<h3 class="modal-title">' + s.name + '</h3>' +
      '<p class="modal-desc">' + s.desc + '</p>' +
      '<div class="modal-meta"><span class="chip">' + s.tag + '</span><span class="chip"><b>小众宝藏</b></span></div>';
  }
  function foodHTML(f) {
    return kicker(f.en) +
      '<h3 class="modal-title">' + f.name + '</h3>' +
      '<img class="modal-img" src="' + f.img + '" alt="' + f.name + '">' +
      '<p class="modal-desc">' + f.desc + '</p>' +
      '<div class="modal-meta"><span class="chip">推荐去处 · <b>' + f.place + '</b></span><span class="chip">人均 · <b>' + f.price + '</b></span></div>';
  }
  function stopHTML(s) {
    return kicker(s.en + ' · ' + s.time) +
      '<h3 class="modal-title">' + s.name + '</h3>' +
      '<img class="modal-img" src="' + s.img + '" alt="' + s.name + '">' +
      '<p class="modal-desc">' + s.desc + '</p>' +
      '<div class="modal-meta"><span class="chip">' + s.tip + '</span></div>';
  }

  function bindDataClick(selector, dict, builder) {
    document.querySelectorAll(selector).forEach(function (el) {
      var key = el.getAttribute('data-key');
      function go() { if (dict[key]) openModal(builder(dict[key])); }
      el.addEventListener('click', go);
      if (el.tagName !== 'BUTTON' && el.getAttribute('role') === 'button') {
        el.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
        });
      }
    });
  }
  bindDataClick('.food-card', FOODS, foodHTML);
  bindDataClick('.food-row', FOODS, foodHTML);
  bindDataClick('.stop', STOPS, stopHTML);
  bindDataClick('.tl-item', STOPS, stopHTML);
  bindDataClick('.map-pin', SPOTS, spotHTML);

  /* ============================================================
     选项卡（交通 / 住宿 / 贴士）
     ============================================================ */
  document.querySelectorAll('.tabs').forEach(function (tabs) {
    var btns = Array.prototype.slice.call(tabs.querySelectorAll('.tab-btn'));
    var panels = Array.prototype.slice.call(tabs.querySelectorAll('.tab-panel'));
    var ink = tabs.querySelector('.tab-ink');
    function select(i) {
      btns.forEach(function (b, j) {
        b.setAttribute('aria-selected', j === i ? 'true' : 'false');
        b.tabIndex = j === i ? 0 : -1;
      });
      panels.forEach(function (p, j) { p.hidden = j !== i; });
      if (ink) ink.style.transform = 'translateX(' + (i * 100) + '%)';
    }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { select(i); });
      b.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { select((i + 1) % btns.length); btns[(i + 1) % btns.length].focus(); }
        if (e.key === 'ArrowLeft') { select((i - 1 + btns.length) % btns.length); btns[(i - 1 + btns.length) % btns.length].focus(); }
      });
    });
    select(0);
  });

  /* ============================================================
     时间线描线动画（滚动驱动 SVG path）
     ============================================================ */
  function setupRail(list, rail) {
    var path = rail.querySelector('path');
    function build() {
      var h = list.offsetHeight - 12;
      if (h <= 0) return;
      rail.setAttribute('viewBox', '0 0 2 ' + h);
      rail.style.height = h + 'px';
      var d = 'M1 0';
      var seg = Math.max(60, h / 8);
      for (var y = seg; y <= h + 1; y += seg) {
        d += ' C 1 ' + (y - seg * 0.6) + ', 1 ' + (y - seg * 0.4) + ', 1 ' + Math.min(y, h);
      }
      path.setAttribute('d', d);
      var len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.dataset.len = len;
    }
    function paint() {
      var len = parseFloat(path.dataset.len || '0');
      if (!len) return;
      var r = list.getBoundingClientRect();
      var vh = window.innerHeight;
      var progress = Math.min(1, Math.max(0, (vh * 0.82 - r.top) / (r.height + vh * 0.3)));
      path.style.strokeDashoffset = reduced ? 0 : len * (1 - progress);
    }
    build(); paint();
    window.addEventListener('resize', function () { build(); paint(); });
    window.addEventListener('scroll', paint, { passive: true });
  }
  var routeList = document.querySelector('.route-list');
  if (routeList) setupRail(routeList, routeList.querySelector('.route-rail'));
  var tl = document.querySelector('.tl');
  if (tl) setupRail(tl, tl.querySelector('.tl-line'));

  /* ---------- 回到顶部 ---------- */
  var toTop = document.querySelector('.to-top');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }
})();