// ===========================
// 🗓️ ข้อมูลรายการหวย
// ===========================
const purchaseData = [
  { date: '01/04/2566', type: '3 ตัวตรง', number: '123', amount: 50 },
  { date: '16/04/2566', type: '2 ตัวล่าง', number: '89', amount: 30 }
];

// ===========================
// ⏰ นาฬิกาแสดงเวลาปัจจุบัน
// ===========================
function updateClock() {
  const clock = document.getElementById("clock");
  const now = new Date();
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  clock.textContent = `${hour}:${minute}`;
}
setInterval(updateClock, 1000);
updateClock();

// ===========================
// ➕ เพิ่มรายการใหม่
// ===========================
function addEntry() {
  const date = document.getElementById('lotteryDate').value;
  const type = document.getElementById('type').value;
  const number = document.getElementById('number').value;
  const amount = parseInt(document.getElementById('amount').value);

  if (!date || !type || !number || isNaN(amount)) {
    Swal.fire({ icon: 'warning', title: 'กรอกไม่ครบ!', text: 'กรุณากรอกข้อมูลให้ครบถ้วน', confirmButtonText: 'เข้าใจแล้ว' });
    return;
  }

  const entry = { date, type, number, amount };
  purchaseData.push(entry);
  renderHistory();
  Swal.fire({ icon: 'success', title: 'เพิ่มรายการแล้ว!', showConfirmButton: false, timer: 1200 });
}

// ===========================
// ♻️ รีเซ็ตฟอร์ม
// ===========================
function resetForm() {
  document.getElementById('lotteryDate').value = '';
  document.getElementById('type').selectedIndex = 0;
  document.getElementById('number').value = '';
  document.getElementById('amount').value = 10;
  document.getElementById('win3top').value = '';
  document.getElementById('win2bottom').value = '';
}

// ===========================
// 📋 แสดงประวัติการซื้อในตาราง
// ===========================
function renderHistory() {
  const list = document.getElementById('historyList');
  list.innerHTML = '';
  purchaseData.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="padding: 0.5rem; border: 1px solid #ccc;">${item.date}</td>
      <td style="padding: 0.5rem; border: 1px solid #ccc;">${item.type}</td>
      <td style="padding: 0.5rem; border: 1px solid #ccc;">${item.number}</td>
      <td style="padding: 0.5rem; border: 1px solid #ccc;">${item.amount}</td>
      <td style="padding: 0.5rem; border: 1px solid #ccc; text-align: center;"><button onclick="deleteEntry(${index})">❌</button></td>
    `;
    list.appendChild(row);
  });
}

function deleteEntry(index) {
  purchaseData.splice(index, 1);
  renderHistory();
}

// ===========================
// 🏆 ตรวจรางวัล
// ===========================
function checkPrize() {
  const win3 = document.getElementById('check3top').value;
  const win2 = document.getElementById('check2bottom').value;
  const resultBox = document.getElementById('checkResult');
  const matches = purchaseData.filter(p =>
    (p.type === '3 ตัวตรง' && p.number === win3) ||
    (p.type === '2 ตัวล่าง' && p.number === win2)
  );
  resultBox.innerHTML = matches.length ?
    `<b>ถูกรางวัล:</b><ul>${matches.map(m => {
      let reward = 0;
      if (m.type === '3 ตัวตรง') reward = m.amount * 900;
      else if (m.type === '3 ตัวโต๊ด') reward = m.amount * 150;
      else if (m.type === '2 ตัวบน' || m.type === '2 ตัวล่าง') reward = m.amount * 90;
      else if (m.type === 'วิ่งบน') reward = m.amount * 3;
      else if (m.type === 'วิ่งล่าง') reward = m.amount * 4;
      return `<li>${m.type} ${m.number} - ได้รับ ${reward.toLocaleString()} บาท</li>`;
    }).join('')}</ul>` :
    'ไม่ถูกรางวัลใดๆ';
}

// ===========================
// 📊 แสดงกราฟสถิติยอดซื้อ
// ===========================
function updateChart() {
  const ctx = document.getElementById('summaryChart');
  const totals = {};
  purchaseData.forEach(p => {
    if (!totals[p.date]) totals[p.date] = 0;
    totals[p.date] += p.amount;
  });
  const sortedDates = Object.keys(totals).sort();
  const data = sortedDates.map(d => totals[d]);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sortedDates,
      datasets: [{
        label: 'ยอดรวมแต่ละงวด (บาท)',
        data: data,
        backgroundColor: '#007bff'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// ===========================
// 🔁 สลับแท็บเมนู
// ===========================
function switchTab(tab) {
  document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.getElementById('tab-' + tab + '-btn').classList.add('active');
  if (tab === 'stats') updateChart();
  if (tab === 'home') updateClock();
}

// ===========================
// 🚀 เริ่มต้นโหลดประวัติเมื่อเปิด
// ===========================
document.addEventListener('DOMContentLoaded', renderHistory);
