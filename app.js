const ProfilePicture = (imageUrl) => {
  return `<div class="profile-picture" style="background-image: url(${imageUrl})"></div>`
}

const BannerImage = (imageUrl, {child}) => {
  return `<div class="banner-image" style="background-image: url(${imageUrl})">${child}</div>`
}

class ViewCard {
  static create(options) {
    let wrapper = document.createElement('div');
    wrapper.innerHTML = `
    <div class="view-card">
      ${BannerImage(options.image, {
        child: `
          ${ProfilePicture(options.logo)}
          <div class="view-card__close"></div>
          <div class="view-card__presentation">
          <div class="view-card__title">${options.title}</div>
          <div class="view-card__subtitle">${options.subtitle}</div>
          </div>
        `
      })}
      <div class="view-card__body">
        ${Card.create({image: options.image, title: 'Project X', subtitle: '32 screens'}).outerHTML}
      </div>
    </div>
    `
    let _el = wrapper.children[0];
    _el.querySelector('.view-card__close').addEventListener('click', ViewCard.close.bind(_el));
    return _el;
  }

  static close() {
    this.remove();
  }
}


class Card {
  static create(options) {
    let wrapper = document.createElement('div');
    wrapper.innerHTML = `
    <div class="card">
      ${BannerImage(options.image, {
        child: options.logo ? ProfilePicture(options.logo) : ''
      })}
      <div class="card__body">
        <div class="card__info">
          <span class="card__info-title">${options.title}</span>
          <div class="card__info-subtitle">${options.subtitle}</div>
        </div>
        <div class="card__specials">
          ${options.specials ? options.specials.map((specialImg, i) => {
            if (i <= 2) {
              let attr = i === 2 ? `more-specials="+${options.specials.length - (i + 1)}"` : ''
              return `<div class="card__special" style="background-image: url(${specialImg})" ${attr}></div>`;
            }
          }).join('') : ''}
        </div>
      </div>
    </div>
    `
    let _el = wrapper.children[0];
    _el.card = Object.assign({}, options);
    _el.applyParallax = Card.applyParallax.bind(null, _el, '.banner-image');
    return _el;
  }

  static applyParallax(element, section) {
    let {left, width} = element.getBoundingClientRect();
    let position = 100 / (document.body.clientWidth / (left + (width / 2)));
    element.querySelector(section)
      .style.backgroundPosition = `${position}% center`;
  }

  static clone(element, className) {
    let _elClientRect = element.getBoundingClientRect();
    let _elClone = element.cloneNode(true);
    _elClone.card = Object.assign({}, element.card);

    className ? _elClone.classList.add(className) : null;
    _elClone.style.top = `${_elClientRect.top}px`;
    _elClone.style.left = `${_elClientRect.left}px`;
    _elClone.style.height = `${_elClientRect.height}px`;
    _elClone.style.width = `${_elClientRect.width}px`;
    return _elClone
  }

  static bindTransition(card, callbackTransitionEnd) {
    let _clone = Card.clone(card, 'card--clone');
    document.body.appendChild(_clone);
    _clone.addEventListener('transitionend', callbackTransitionEnd);
    setTimeout(() => _clone.classList.add('card--clone__moving'), 50);
  }
}

const forEach = (array, fn) => Array.from(array).forEach(fn);
const bindParallax = (nodeChildren) => forEach(nodeChildren, card => card.applyParallax());

let cards = [1, 2, 3].reduce((acc, i) => {
  acc = acc.concat([
    Card.create({
      id: '1'+i,
      image: './img/route-66.png',
      title: 'InVision Craft',
      subtitle: '3 PROJECTS',
      logo: './img/route-66.png',
      specials: ['./img/userA.jpg', './img/userB.jpg']
    }),
    Card.create({
      id: '2'+i,
      image: './img/seattle.png',
      title: 'Nike Running',
      subtitle: '14 PROJECTS',
      logo: './img/seattle.png',
      specials: ['./img/userA.jpg', './img/userB.jpg', './img/userC.png', 3, 4, 5]
    }),
    Card.create({
      id: '3'+i,
      image: './img/anduin.png',
      title: 'Relate UI Kit',
      subtitle: '7 PROJECTS',
      logo: './img/anduin.png',
      specials: ['./img/userD.png', './img/userE.png', './img/userF.jpg', 4, 5, 6, 7, 8]
    }),
    Card.create({
      id: '4'+i,
      image: './img/sunset.png',
      title: 'Serum Design',
      subtitle: '18 PROJECTS',
      logo: './img/sunset.png',
      specials: ['./img/userC.png', './img/userD.png', './img/userE.png', 4, 5, 6, 7, 8, 9, 10, 11, 12]
    })
  ]);
  return acc;
}, []);

const cardsDOM = document.querySelector('.cards');
forEach(cards, (card) => cardsDOM.appendChild(card));
const cardsItems = cardsDOM.children;
document.addEventListener('DOMContentLoaded', bindParallax.bind(null, cardsItems));
cardsDOM.addEventListener('scroll', bindParallax.bind(null, cardsItems));

forEach(cardsItems, card => {
  card.addEventListener('click', () => Card.bindTransition(card, onTransitionEnd(0)));
});

const onTransitionEnd = (counter) => (e) => {
  if (counter) return;
  ++counter;
  e.target.remove();
  document.body.appendChild(ViewCard.create(Object.assign({}, e.target.card)));
}

