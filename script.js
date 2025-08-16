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

  document.getElementById('plansContainer').innerHTML = '';
  
  showPlanWithFlow(plan, plans.length - 1);

  this.reset();
});

function daysLeft(examDate) {
  const today = new Date();
  const exam = new Date(examDate);
  const diff = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function showPlanWithFlow(plan, index){
  const container = document.getElementById('plansContainer');
  const flowContainer = document.getElementById('flowchartContainer');

  const days = daysLeft(plan.examDate);

  const div = document.createElement('div');
  div.className = 'plan';
  div.innerHTML = `
    <strong>${plan.examName}</strong> - ${plan.examDate} 
    <span style="color:green">(in ${days} days)</span><br><br>
    <b>Study Topics:</b> ${plan.studyTopics.join(', ')} <br>
    <b>Sub Topics:</b> ${plan.subTopics.join(', ')} <br>
    <b>Study Time:</b> ${plan.topicHours}h ${plan.topicMinutes}m per topic <br>
    <b>Study Time:</b> ${plan.subTopicHours}h ${plan.subTopicMinutes}m per sub-topic <br><br>
    <button onclick="deletePlan(${index})" style="background:red">Delete</button>
  `;
  container.appendChild(div);

  flowContainer.innerHTML = '';
  const flowDiv = document.createElement('div');
  flowDiv.className = 'flowchart-plan';
  flowContainer.appendChild(flowDiv);

  const examNode = document.createElement('div');
  examNode.className = 'flow-node';
  examNode.textContent = `Exam: ${plan.examName} (${plan.examDate})`;
  flowDiv.appendChild(examNode);

  plan.studyTopics.forEach(topic => {
    const topicNode = document.createElement('div');
    topicNode.className = 'flow-node';
    topicNode.style.marginLeft = '30px';
    topicNode.textContent = `Topic: ${topic} (${plan.topicHours}h ${plan.topicMinutes}m)`;
    flowDiv.appendChild(topicNode);

    plan.subTopics.forEach(sub => {
      const subNode = document.createElement('div');
      subNode.className = 'flow-node';
      subNode.style.marginLeft = '60px';
      subNode.textContent = `Subtopic: ${sub} (${plan.subTopicHours}h ${plan.subTopicMinutes}m)`;
      flowDiv.appendChild(subNode);
    });
  });
}


function showPreviousPlans(){
  const container = document.getElementById('plansContainer');
  container.innerHTML = ''; // clear container
  const flowContainer = document.getElementById('flowchartContainer');
  flowContainer.innerHTML = ''; 

  if(plans.length === 0){
    container.innerHTML = '<p>No plans saved.</p>';
    return;
  }


  for(let i = 0; i < plans.length - 1; i++){
    showPlanWithButton(plans[i], i);
  }
}

function showPlanWithButton(plan, index){
  const container = document.getElementById('plansContainer');
  const days = daysLeft(plan.examDate);

  const div = document.createElement('div');
  div.className = 'plan';
  div.innerHTML = `
    <strong>${plan.examName}</strong> - ${plan.examDate} 
    <span style="color:green">(in ${days} days)</span><br><br>
    <b>Study Topics:</b> ${plan.studyTopics.join(', ')} <br>
    <b>Sub Topics:</b> ${plan.subTopics.join(', ')} <br>
    <b>Study Time:</b> ${plan.topicHours}h ${plan.topicMinutes}m per topic <br>
    <b>Study Time:</b> ${plan.subTopicHours}h ${plan.subTopicMinutes}m per sub-topic <br><br>
    <button onclick="showFlowchart(${index})">Show Flowchart</button>
    <button onclick="deletePlan(${index})" style="background:red">Delete</button>
  `;
  container.appendChild(div);
}


function showFlowchart(index){
  const flowContainer = document.getElementById('flowchartContainer');
  flowContainer.innerHTML = '';

  const plan = plans[index];
  const flowDiv = document.createElement('div');
  flowDiv.className = 'flowchart-plan';
  flowContainer.appendChild(flowDiv);

  const examNode = document.createElement('div');
  examNode.className = 'flow-node';
  examNode.textContent = `Exam: ${plan.examName} (${plan.examDate})`;
  flowDiv.appendChild(examNode);

  plan.studyTopics.forEach(topic => {
    const topicNode = document.createElement('div');
    topicNode.className = 'flow-node';
    topicNode.style.marginLeft = '30px';
    topicNode.textContent = `Topic: ${topic} (${plan.topicHours}h ${plan.topicMinutes}m)`;
    flowDiv.appendChild(topicNode);

    plan.subTopics.forEach(sub => {
      const subNode = document.createElement('div');
      subNode.className = 'flow-node';
      subNode.style.marginLeft = '60px';
      subNode.textContent = `Subtopic: ${sub} (${plan.subTopicHours}h ${plan.subTopicMinutes}m)`;
      flowDiv.appendChild(subNode);
    });
  });
}

function deletePlan(index){
  plans.splice(index,1);
  localStorage.setItem('studyPlans', JSON.stringify(plans));
  document.getElementById('plansContainer').innerHTML = '';
  document.getElementById('flowchartContainer').innerHTML = '';


  if(plans.length > 0){
    showPlanWithFlow(plans[plans.length-1], plans.length-1);
  }
}

// Show previous plans button
document.getElementById('showPlans').addEventListener('click', showPreviousPlans);
