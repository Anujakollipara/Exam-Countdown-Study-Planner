let plans = JSON.parse(localStorage.getItem('studyPlans')) || [];


document.getElementById('examForm').addEventListener('submit', function(e){
  e.preventDefault();
  const plan = {
    examName: document.getElementById('examName').value,
    examDate: document.getElementById('examDate').value,
    studyTopics: document.getElementById('studyTopics').value.split(',').map(t=>t.trim()),
    subTopics: document.getElementById('subTopics').value.split(',').map(t=>t.trim()),
    topicHours: document.getElementById('topicHours').value,
    topicMinutes: document.getElementById('topicMinutes').value,
    subTopicHours: document.getElementById('subTopicHours').value,
    subTopicMinutes: document.getElementById('subTopicMinutes').value
  };

  plans.push(plan); 
  localStorage.setItem('studyPlans', JSON.stringify(plans)); 

  showNewPlan(plan, plans.length - 1);

  this.reset();
});


function showNewPlan(plan, index) {
  const container = document.getElementById('plansContainer');
  const flow = document.getElementById('flowchartContainer');

  container.innerHTML = ''; // clear previous display
  flow.innerHTML = '';

  const div = document.createElement('div');
  div.className = 'plan';
  div.innerHTML = `
    <strong>${plan.examName}</strong> (${plan.examDate}) 
    <button onclick="deletePlan(${index})">Delete</button>
    <button onclick="showFlowchart(${index})">Flowchart</button>
  `;
  container.appendChild(div);
}

document.getElementById('showPlans').addEventListener('click', function(){
  const container = document.getElementById('plansContainer');
  container.innerHTML = ''; // clear current display

  if(plans.length === 0) { container.innerHTML = '<p>No plans saved.</p>'; return; }

  plans.forEach((p,i) => {
    const div = document.createElement('div');
    div.className = 'plan';
    div.innerHTML = `
      <strong>${p.examName}</strong> (${p.examDate}) 
      <button onclick="deletePlan(${i})">Delete</button>
      <button onclick="showFlowchart(${i})">Flowchart</button>
    `;
    container.appendChild(div);
  });
});


function deletePlan(index) {
  plans.splice(index,1);
  localStorage.setItem('studyPlans', JSON.stringify(plans));
  document.getElementById('plansContainer').innerHTML = '';
  document.getElementById('flowchartContainer').innerHTML = '';
}

function showFlowchart(index) {
  const flow = document.getElementById('flowchartContainer');
  flow.innerHTML = '';
  const p = plans[index];

  const examNode = document.createElement('div');
  examNode.className = 'flow-node';
  examNode.textContent = `Exam: ${p.examName} (${p.examDate})`;
  flow.appendChild(examNode);

  p.studyTopics.forEach(topic => {
    const topicNode = document.createElement('div');
    topicNode.className = 'flow-node';
    topicNode.style.marginLeft = '30px';
    topicNode.textContent = `Topic: ${topic} (${p.topicHours}h ${p.topicMinutes}m)`;
    flow.appendChild(topicNode);

    p.subTopics.forEach(sub => {
      const subNode = document.createElement('div');
      subNode.className = 'flow-node';
      subNode.style.marginLeft = '60px';
      subNode.textContent = `Subtopic: ${sub} (${p.subTopicHours}h ${p.subTopicMinutes}m)`;
      flow.appendChild(subNode);
    });
  });
}
