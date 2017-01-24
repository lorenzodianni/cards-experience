const Card = (options) => {
  return `
  <div class="card">
    <div class="card__header" style="background-image: url(${options.image})">
      <div class="profile__picture" style="background-image: url(${options.logo})"></div>
    </div>
    <div class="card__body">
      <div class="card__info">
        <span class="card__info-name">${options.name}</span>
        <div class="card__info-projects">${options.projects}</div>
      </div>
      <div class="card__users">
        ${options.users.map((userImg, i) => {
          if(i <= 2) {
            let attr = i === 2 ? `more-users="+${options.users.length - (i+1)}"` : ''
            return `<div class="card__user" style="background-image: url(${userImg})" ${attr}></div>`;
          }
        }).join('')}
      </div>
    </div>
  </div>
  `
}

const forEach = (array, fn) => Array.from(array).forEach(fn);
const applyParallax = (element, i) => {
  let {left, width} = element.getBoundingClientRect();
  let position = 100 / (document.body.clientWidth / (left + (width/2)));
  element.querySelector('.card__header')
    .style.backgroundPosition = `${position}% center`;
}

let cards = [1,2,3].reduce(acc => {
  acc = acc.concat([
    Card({
      image: './img/seattle.png',
      name: 'Nike Running',
      projects: '14 PROJECTS',
      logo: './img/seattle.png',
      users: ['./img/userA.jpg', './img/userB.jpg', './img/userC.png', 3,4,5]
    }),
    Card({
      image: './img/anduin.png',
      name: 'Relate UI Kit',
      projects: '7 PROJECTS',
      logo: './img/anduin.png',
      users: ['./img/userD.png', './img/userE.png',  './img/userF.jpg', 4,5,6,7,8]
    }),
    Card({
      image: './img/route-66.png',
      name: 'InVision Craft',
      projects: '3 PROJECTS',
      logo: './img/route-66.png',
      users: ['./img/userA.jpg', './img/userB.jpg']
    }),
    Card({
      image: './img/sunset.png',
      name: 'Serum Design',
      projects: '18 PROJECTS',
      logo: './img/sunset.png',
      users: ['./img/userC.png', './img/userD.png', './img/userE.png', 4,5,6,7,8,9,10,11,12]
    })
  ]);
  return acc;
}, [])

const cardsDOM = document.querySelector('.cards');
cardsDOM.innerHTML = cards.join('');
document.addEventListener('DOMContentLoaded', () => {
  forEach(cardsDOM.children, applyParallax);
})
cardsDOM.addEventListener('scroll', e => {
  forEach(e.target.children, applyParallax);
});

forEach(cardsDOM.children, (card) => {
  card.addEventListener('click', function() {
    let profilePicture = this.querySelector('.profile__picture');
    let cardHeader = this.querySelector('.card__header');

    let _pClone = profilePicture.cloneNode(true);
    _pClone.style.top = `${profilePicture.getBoundingClientRect().top}px`;
    _pClone.style.left = `${profilePicture.getBoundingClientRect().left}px`;
    _pClone.style.transform = `none`;
    document.body.appendChild(_pClone);
    console.log(profilePicture.getBoundingClientRect());
    console.log(cardHeader.getBoundingClientRect());
    console.dir(this)
  });
})

