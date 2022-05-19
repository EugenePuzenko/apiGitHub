const input = document.getElementById('autocompleteInput')
const autocompleteList = document.getElementById('autocompleteList')
const selectedList = document.getElementById('selectedList')
const selectedItems = selectedList.children

class Autocomplete {
  showFirstFiveRepositories(repo){
    repo.forEach(function (repo) {
      let li = document.createElement('li')
      li.classList.add('item')
      li.innerHTML = repo.name
      autocompleteList.appendChild(li)
    })
  }
  
  addToSelectedList(data){
    let div = document.createElement('div')
    let textBlock = document.createElement('div')
    let name = document.createElement('p')
    let owner = document.createElement('p')
    let stars = document.createElement('p')
    let close = document.createElement('button')
    div.classList.add('selected-item')
    name.classList.add('selected-text')
    owner.classList.add('selected-text')
    stars.classList.add('selected-text')
    close.classList.add('selected-delete')
    textBlock.classList.add('text-block')
    name.innerHTML = `Name: ${data.name}`
    owner.innerHTML = `Owner: ${data.owner.login}`
    stars.innerHTML = `Stars: ${data.stargazers_count}`
    textBlock.appendChild(name)
    textBlock.appendChild(owner)
    textBlock.appendChild(stars)
    div.appendChild(textBlock)
    div.appendChild(close)
    document.getElementById('selectedList').appendChild(div)
  }
}
  
const autocomplete = new Autocomplete();

async function getRepo(userText) {
  const repoResponse = await fetch(`https://api.github.com/search/repositories?q=${userText}&sort=stars&per_page=5`);
  if (repoResponse.status === 200) {
    const repo = await repoResponse.json();
    return [...repo.items]
  } else {
    return
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
  if (input.value === '') {
    autocompleteList.innerHTML = '';
    return
  }
  
  getRepo(e.target.value).then(data => {
    if (e.target.value != '') {
      autocompleteList.innerHTML = '';
      autocomplete.showFirstFiveRepositories(data);
    }

    autocompleteList.addEventListener('click', foo = (e) => {
      if (selectedItems.length < 3) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].name === e.target.innerHTML) {
            autocompleteList.innerHTML = '';
            autocomplete.addToSelectedList(data[i])
          }
        }
        autocompleteList.removeEventListener('click', foo) 
      } else {
        return
      }
    }, {once: true})
  })
}

const debouncedhandle = debounce(handleInput, 300);

input.addEventListener('keyup', debouncedhandle)

selectedList.addEventListener('click', e => {
  if (e.target.className != 'selected-delete') return;
  let listItem = e.target.closest('.selected-item');
  listItem.remove();
})