const input = document.getElementById('autocompleteInput')
const autocompleteList = document.getElementById('autocompleteList')
const selectedList = document.getElementById('selectedList')
const selectedItems = selectedList.children
const autocompleteListItems = autocompleteList.children
const url = "https://api.github.com/search/repositories"

class Autocomplete {
  constructor(data) {
    this.data = data;
  }

  showFirstFiveRepositories(repo){
    repo.forEach(function (repo) {
      const li = document.createElement('li')
      li.classList.add('item')
      li.innerHTML = repo.name
      autocompleteList.appendChild(li)
    })
  }
  
  addToSelectedList(data){
    const template = 
    ` <div class='text-block'>
        <p class='selected-text'>Name: ${data.name}</p>
        <p class='selected-text'>Owner: ${data.owner.login}</p>
        <p class='selected-text'>Stars: ${data.stargazers_count}</p>
      </div>
    <button class='selected-delete'></button>`
    const div = document.createElement('div')
    div.classList.add('selected-item')
    div.innerHTML = template
    document.getElementById('selectedList').appendChild(div)
  }
}
  
const autocomplete = new Autocomplete();

async function getRepo(userText) {
  const repoResponse = await fetch(`${url}?q=${userText}&sort=stars&per_page=5`);
  if (repoResponse.status === 200) {
    const repo = await repoResponse.json();
    return [...repo.items]
  }
}

const debounce = (fn, ms) => {
  let timeout;
  return function () {
    const fnCall = () => { fn.apply(this, arguments) }
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, ms)
  }
}

function handleInput(e) {
  if (!input.value) {
    autocompleteList.innerHTML = '';
    return
  }
  
  getRepo(e.target.value).then(data => {
    autocompleteList.innerHTML = '';
    autocomplete.data = data;
    autocomplete.showFirstFiveRepositories(data);
  })
}

autocompleteList.addEventListener('click', (e) => {
  if (selectedItems.length < 3) {
    for (let i = 0; i < autocompleteListItems.length; i++) {
      if (autocomplete.data[i].name === e.target.innerHTML) {
        autocomplete.addToSelectedList(autocomplete.data[i])
        autocompleteList.innerHTML = '';
      }
    }
  } else {
    return
  }
})

const debouncedhandle = debounce(handleInput, 300);

input.addEventListener('keyup', debouncedhandle)

selectedList.addEventListener('click', e => {
  if (e.target.className != 'selected-delete') return;
  let listItem = e.target.closest('.selected-item');
  listItem.remove();
})
