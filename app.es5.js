'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var app = document.querySelector('#app');
var forEach = function forEach(array, fn) {
  return Array.from(array).forEach(fn);
};
var isFunction = function isFunction(value) {
  return typeof value === 'function';
};
var bindParallax = function bindParallax(list) {
  return forEach(list, function (card) {
    return card.card ? Card.applyParallax(card, '.banner-image') : null;
  });
};
var random = function random() {
  var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
var randomAvatar = function randomAvatar() {
  return 'https://api.adorable.io/avatars/' + random(1, 1000);
};
var arrayFromInt = function arrayFromInt(n) {
  return Array.from(Array(n), function (u, i) {
    return i;
  });
};

var ProfilePicture = function ProfilePicture(imageUrl) {
  return '<div class="profile-picture" style="background-image: url(' + imageUrl + ')"></div>';
};

var BannerImage = function BannerImage(imageUrl, _ref) {
  var child = _ref.child;
  return '<div class="banner-image" style="background-image: url(' + imageUrl + ')">' + child + '</div>';
};

var ViewCard = function () {
  function ViewCard() {
    _classCallCheck(this, ViewCard);
  }

  _createClass(ViewCard, null, [{
    key: 'create',
    value: function create(options) {
      var wrapper = document.createElement('div');
      wrapper.innerHTML = '\n    <div class="view-card">\n      ' + BannerImage(options.image, {
        child: '\n          ' + ProfilePicture(options.logo) + '\n          <div class="view-card__close"></div>\n          <div class="view-card__presentation">\n          <div class="view-card__title">' + options.title + '</div>\n          <div class="view-card__subtitle">' + options.subtitle + '</div>\n          </div>\n        '
      }) + '\n      <div class="view-card__body">\n        ' + Card.create({
        image: options.image,
        title: 'Project X',
        subtitle: '32 screens'
      }).outerHTML + '\n      </div>\n    </div>\n    ';
      var _el = wrapper.children[0];
      _el.connectedCard = options.connectedCard;
      return _el;
    }
  }, {
    key: 'close',
    value: function close(viewCard, callback) {
      viewCard.classList.add('view-card--out');
      isFunction(callback) ? viewCard.addEventListener('animationend', callback.bind(null, viewCard)) : null;
    }
  }]);

  return ViewCard;
}();

var Card = function () {
  function Card() {
    _classCallCheck(this, Card);
  }

  _createClass(Card, null, [{
    key: 'create',
    value: function create(options) {
      var wrapper = document.createElement('div');
      wrapper.innerHTML = '\n    <div class="card">\n      ' + BannerImage(options.image, {
        child: options.logo ? ProfilePicture(options.logo) : ''
      }) + '\n      <div class="card__body">\n        <div class="card__info">\n          <span class="card__info-title">' + options.title + '</span>\n          <div class="card__info-subtitle">' + options.subtitle + '</div>\n        </div>\n        <div class="card__specials">\n          ' + (options.specials ? options.specials.map(function (specialImg, i) {
        if (i <= 2) {
          var attr = i === 2 ? 'more-specials="+' + (options.specials.length - (i + 1)) + '"' : '';
          return '<div class="card__special" style="background-image: url(' + specialImg + ')" ' + attr + '></div>';
        }
      }).join('') : '') + '\n        </div>\n      </div>\n    </div>\n    ';
      var _el = wrapper.children[0];
      _el.card = Object.assign({}, options);
      return _el;
    }
  }, {
    key: 'applyParallax',
    value: function applyParallax(element, section) {
      // let {left, width} = element.getBoundingClientRect();
      // let position = (100 / (document.body.clientWidth / (left + (width / 2))));
      var leftPosition = element.parentElement.scrollLeft - element.offsetLeft;
      var marginSize = (app.clientWidth - element.clientWidth) * 1.5;
      var position = 50 / (app.clientWidth / (leftPosition + marginSize + element.clientWidth));
      element.querySelector(section).style.backgroundPosition = position + '% center';
    }
  }, {
    key: 'clone',
    value: function clone(element, _ref2) {
      var addClass = _ref2.addClass;

      var _elClientRect = element.getBoundingClientRect();
      var _elClone = element.cloneNode(true);
      _elClone.card = Object.assign({}, element.card);
      addClass ? _elClone.classList.add(addClass) : null;
      _elClone.style.top = _elClientRect.top - app.offsetTop + 'px';
      _elClone.style.left = _elClientRect.left - app.offsetLeft + 'px';
      _elClone.style.height = _elClientRect.height + 'px';
      _elClone.style.width = _elClientRect.width + 'px';
      return _elClone;
    }
  }, {
    key: 'startAnimation',
    value: function startAnimation(card, onTransitionEnd) {
      var _clone = Card.clone(card, { addClass: 'card--clone' });
      _clone.reverseAnimation = Card.reverseAnimation.bind(null, _clone);
      isFunction(onTransitionEnd) ? _clone.addEventListener('transitionend', onTransitionEnd) : null;
      app.appendChild(_clone);
      setTimeout(function () {
        return _clone.classList.add('card--animating');
      }, 50);
    }
  }, {
    key: 'reverseAnimation',
    value: function reverseAnimation(card, onTransitionEnd) {
      card.classList.remove('card--animating');
      isFunction(onTransitionEnd) ? card.addEventListener('transitionend', onTransitionEnd) : null;
    }
  }]);

  return Card;
}();

var onCardTransitionEnd = function onCardTransitionEnd(counter) {
  return function (e) {
    if (!counter && e.target.className.includes('card--clone')) {
      ++counter;
      renderViewCard(e.target);
    }
  };
};

var onCardViewAnimationOutEnd = function onCardViewAnimationOutEnd(counter) {
  return function (viewCard) {
    if (counter) return;
    ++counter;
    removeViewCard(viewCard);
  };
};

var renderViewCard = function renderViewCard(connectedCard) {
  var options = Object.assign({ connectedCard: connectedCard }, connectedCard.card);
  var viewCard = ViewCard.create(options);
  app.appendChild(viewCard);
  document.querySelector('.view-card__close').addEventListener('click', function () {
    return ViewCard.close(viewCard, onCardViewAnimationOutEnd(0));
  });
};

var removeViewCard = function removeViewCard(viewCard) {
  var connectedCard = viewCard.connectedCard;

  viewCard.remove();
  connectedCard.reverseAnimation(function () {
    return connectedCard.remove();
  });
};

var render = function render() {
  var cardsDOM = document.createElement('div');
  var cards = [1].reduce(function (acc) {
    acc = acc.concat([Card.create({
      image: 'https://d13yacurqjgara.cloudfront.net/users/31752/screenshots/2059749/route-66.png',
      title: 'InVision Craft',
      subtitle: random() + ' PROJECTS',
      logo: 'https://d13yacurqjgara.cloudfront.net/users/31752/screenshots/2059749/route-66.png',
      specials: arrayFromInt(random()).map(randomAvatar)
    }), Card.create({
      image: 'https://d13yacurqjgara.cloudfront.net/users/31752/screenshots/2053253/seattle.png',
      title: 'Nike Running',
      subtitle: random() + ' PROJECTS',
      logo: 'https://d13yacurqjgara.cloudfront.net/users/31752/screenshots/2053253/seattle.png',
      specials: arrayFromInt(random()).map(randomAvatar)
    }), Card.create({
      image: 'https://d13yacurqjgara.cloudfront.net/users/31752/screenshots/2236968/anduin.png',
      title: 'Relate UI Kit',
      subtitle: random() + ' PROJECTS',
      logo: 'https://d13yacurqjgara.cloudfront.net/users/31752/screenshots/2236968/anduin.png',
      specials: arrayFromInt(random()).map(randomAvatar)
    }), Card.create({
      image: 'https://d13yacurqjgara.cloudfront.net/users/31752/screenshots/2109505/sunset.png',
      title: 'Serum Design',
      subtitle: random() + ' PROJECTS',
      logo: 'https://d13yacurqjgara.cloudfront.net/users/31752/screenshots/2109505/sunset.png',
      specials: arrayFromInt(random()).map(randomAvatar)
    })]);
    return acc;
  }, []);

  cardsDOM.classList.add('cards');
  cardsDOM.addEventListener('scroll', function () {
    return bindParallax(cardsDOM.children);
  });

  forEach(cards, function (card) {
    cardsDOM.appendChild(card);
    card.addEventListener('click', function () {
      return Card.startAnimation(card, onCardTransitionEnd(0));
    });
  });

  cardsDOM.insertAdjacentHTML('beforeEnd', '<div class="card--ghost"></div>');
  app.appendChild(cardsDOM);
  document.addEventListener('DOMContentLoaded', function () {
    return bindParallax(cardsDOM.children);
  });
};

render();
