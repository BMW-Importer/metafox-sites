// eslint-disable-next-line import/no-cycle
import { getStockLocatorFiltersData, getStockLocatorVehiclesData } from '../../scripts/common/wdh-util.js';
import {
  DEV, STAGE, PROD, disclaimerGQlEndpoint,
} from '../../scripts/common/constants.js';


let currentlyOpenDropdown = null;
function handleToggleFilterDropDown() {
  const filterSelectors = document.querySelectorAll('.filter-label-heading');
  filterSelectors.forEach((item) => {
    item.addEventListener('click', (e) => {
      const dropdown = e.target.nextElementSibling;
      if (currentlyOpenDropdown && currentlyOpenDropdown !== dropdown) {
        currentlyOpenDropdown.style.display = 'none';
        currentlyOpenDropdown.previousElementSibling.classList.remove('show-dropdown');
      }
      if (dropdown) {
        e.target.classList.toggle('show-dropdown');
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        currentlyOpenDropdown = dropdown.style.display === 'block' ? dropdown : null;
      }
    });
  });
  handleCheckBoxSelectionForSeries();
}

function handleMobileSeriesFilter() {
  const filterItems = document.querySelectorAll('.filter-list.dropdown-list-wrapper .filter-item');
  filterItems.forEach((item) => {
    item.addEventListener('click', () => {
      item.classList.toggle('selected-filter');
    });
  });
}

function handleCancelSelectedValue(values) {
  const cancelSelectors = document.querySelectorAll('.cancel-filter');
  cancelSelectors.forEach((item) => {
    item.addEventListener('click', () => {
      const valueElement = item.parentElement;
      valueElement.remove();
      removeLastSelectedValue(values);
    });
  });
}

function removeLastSelectedValue(values) {
  for (const [heading, valuesArray] of Object.entries(values)) {
    if (valuesArray.length > 0) {
      // Remove the last value from the array
      valuesArray.pop();
      if (valuesArray.length === 0) {
        delete values[heading];
      }
      break;
    }
  }

  updateSelectedValues(values);
  vehicleURL = constructVehicleUrl(values);
  getStockLocatorVehiclesData(vehicleURL);
  if (Object.entries(values).length === 0 && values.constructor === Object) {

    const checkboxes = document.querySelectorAll('.filter-checkbox');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  const filterLabels = document.querySelectorAll('.filter-label-heading');
  filterLabels.forEach((label) => {
    label.classList.remove('is-active');
  });
    currentlyOpenDropdown.style.display = 'none';
    currentlyOpenDropdown.previousElementSibling.classList.remove('show-dropdown');
  }
}

// function handleCheckBoxSelectionForSeries() {
//   const filterLists = document.querySelectorAll('.filter-list');
//   filterLists.forEach((filterList) => {
//     const filterLabelHeading = filterList.previousElementSibling;
//     const checkboxes = filterList.querySelectorAll('.filter-checkbox');
//     const selectedValues = [];
//     const selectedCheckBoxType = [];

//     checkboxes.forEach((checkbox) => {
//       checkbox.addEventListener('change', () => {
//         if (checkbox.checked) {
//           if (!filterLabelHeading.classList.contains('is-active')) {
//             filterLabelHeading.classList.add('is-active');
//           }
//           selectedValues.push(checkbox.id);
//           selectedCheckBoxType.push(filterLabelHeading.textContent);
//         } else {
//           const index = selectedValues.indexOf(checkbox.id);
//           if (index !== -1) {
//             selectedValues.splice(index, 1);
//           }
//           // Remove is-active class if no checkbox is selected
//           if (selectedValues.length === 0) {
//             filterLabelHeading.classList.remove('is-active');
//           }
//         }
//         // Update the displayed selected values
//         // eslint-disable-next-line no-use-before-define
//         updateSelectedValues(selectedValues, filterList);
//         console.log(selectedValues);
//         console.log(selectedCheckBoxType);
//       });
//     });
//   });
// }

// eslint-disable-next-line import/no-mutable-exports
export let vehicleURL;

let getStockLocatorVehicles = [];

function cardTiles() {
  const cardWrapper = document.querySelector('.card-tile-wrapper') || document.createElement('div');
  cardWrapper.innerHTML = '';
  cardWrapper.classList.add('card-tile-wrapper');

  const cardList = document.createElement('ul');
  cardList.classList.add('card-tile-list');

  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card-tile-container');

  getStockLocatorVehicles.data.map((vehicle) => {
  const { model, powerKw, powerPs, priceInformation : {baseCurrencyCodeA, finalPriceWithTax}, groupReference } = vehicle.attributes;

  const cardListElement = document.createElement('li');
  cardListElement.classList.add('card-tile-list-ele');

  const modelCard = document.createElement('div');
  modelCard.classList.add('model-card');

  const cardImgContainer = document.createElement('div');
  cardImgContainer.classList.add('image-container');

  const pictureTag = document.createElement('picture');

  const imgElem = document.createElement('img');
  imgElem.classList.add('stocklocator-card-img');
  imgElem.src = 'data:image/webp;base64,UklGRuoZAABXRUJQVlA4IN4ZAAAwcACdASpKAZYAPm0wlEekIqIhJRTcyIANiWlu3WAKMQ2K0yDecMCL82Pjz+08L/Lr762078fyngV9sP5fnb36/E//Z9Qv8a/nv+o/s3rHfX971rf+m/4nqU+2H2j/ff3H8ofmSnGfdHuN7gPfg+HN537AX6B/6/ql/9/+y9IX07/6P818CP84/tv/T9eL2P/uH7KX7Vf/88H05znJEZS59DApHkpEC7Rw0aOkBMSQG/+JHldSNyHVb0xbT9TcPum10pYv76A+nOc5x33Wx4z/KmbWabkOT4dMJ5HbnlCV+9I6ipff5aAOrYZOj+TuIVKh+kFE8MMshoKmy3HZWvrDNZvls9zXZKVeVZkDG73r33vO6QUAgtz7ICmP27wRkabzrD2AQ9pr/AXDCBERJiJgX93PU1+5B/dGLB9uX12lF/TFs7xHIgOgyTl6+nYinQkje0jvdgLvHHts2j40y+5GN1K/uWK6mh4JV61clTV85uXMLuXmpCOg/qrwoX/ajIihTOKhZg58ZYmwIu0jONNoa/fJMbmHcAW0l8fZDwXKVOTZXsYU2eQQqijCMgGFRjtR0DmoRTdxRrRzDCRtY9UPlt/9VQ8GVjpietgbXcWCME6C5tijxODf0OIz021DGQna7lHRkTae2yTlg4gp///6LIHTUc7+9tAZWTdwJ5drLXY7ozvNycPV5QMlGIP2CNc3BJbPjnMbfsUfmCTPIBqCM5hDLqIRnd0aMvKWXGGP/SdrU/THc04JwYb+X4GMmo98jSnRe5GzGThGrdpZJWcbFXIoly++vkZWU5hujT5TwFO48wM6Y/yI5x3ssaPrPVPrHv1M78BNKxpcS3tPoVsW110pL1kA+Bc2oGDKo9zOu26GBYnSrrWEV5wGuLd/hWBhYZ0O7NQr6L8fO4Fa73q8bBy2H3fXdpqqJd2xMr74zsSYuHWl6zfGCGYfB/z6c0EJq/wfR0g4NgoWp03SFAekKxxqkqvvP8vCARPBP/u9J/PD0wLAiLURl+pyOsTWBsS+ioe1X5uC8YZGhwzUyASsUA2tfbP45ypcUCTrjQRQjVst7v8M6e5li08sTUPyoS1Hy3t/i/VsBlOZu3+vZKDoaDoAoX+PqUVENDCqaJNw2MjfaOhWWPvScRHtn3skAMN5W21UMzlK+/Y3O7eYMb4RMlgC6+MkcBSlb1he973ve97+a2rD6c5ziAAA/vyoAC+57yvS5rCRfVviajZcD35LyEMwU1z+w61udDMIZc+/b0WenITvP0H1blcpi3oyXrqiR3zA3N73Og5gHDJQ9dbCpDMyQwy4Be5ERxxZoX4DhhdK09kEMAcvaeILOW6lq/64pRzm57f1TRPYCnSwxgEs6Ls+XXjKM88MBnKpwu12wTR2uls14WIdTK5X5JZgkgy7iq29UoU1gLKZn76FeBqQORAwPZ8Mlqhn8DOfIvmaMp13M+AMf7O2hx2SbSEmHjyBFpROMk3Hh1aXDgNh6JwBEiiTY+hKmGkeKmZDygCBQyPQKnsJgy0u+LYLhiYHXG7Gnf/1+Vi59Vn4k7lmsB3aWlPjQULlUC7aBDcz0yp99CdcfGRai2b5zO/xE17NGQsl3D2g+VQBiRH4lZo8E3UF+KwfwqEcr+bjxv4Yv9SnCN4joKO+qlJSHUTSj4CG1nv/O9+9FngZX9q/qVbW+xkse3J8xJ8xMxhzB68nYlVRNM5ZalyNrt9nROvB5wqvyLdezio3/+zhIUcFYETps4fDUe8iqXQc0U96tgglxgvtqAS0iWl04Gom/nznByxdsCDyjlI5Lyw4+HbEFVyM5DnBYJb5afm/Cm+m2r9tWb1SeHUy0Gmo4VhyJ8cVJENi0jSTi2j4RuC2W+46DLikRp3iUnjXVmJnD/ja5CXMdKILUF4jhJVdgf6CtP9V08b1m4fXkXwH00H9rTH6T5W0p4/8HF6FSkpU7kX5aPBRwgpGP6nKg4zL52kDbdE14eEU6+6j28IPeszlWqyS5/+sCvmcEA5HD33FQfDnJSqHXZyhS+ET96OIXVPulVgHtWBfBMvUShl9BKzUW5NZJcwMOCFMLs7H5xYz6TgHNGdoeA3oxc8k95hz7E0xw5zkOtI7u4zLiCYcZvj3jBehJzinyPvHJnq+FnbxTtKGWoS4HepQM9o06rtIPFfU2xYOtRNN+7Btwp5rj9RRp5mMEKClu6YfMj0TeZo3iMGD09snpIOgy1RWwGruToXYe6aK8dQGnTPH/WXqV3SLVSyxlZh8vzJX3TN3Hi7LljSP75e+hpBDRNYnzvQPzHkyOYfrknEuI4QZLNuCF2MsADY3XFFJH1lWvciqqGk6pvDOeIENN5Dug4XrIFKWjgd05yTFALMl6w1P7QIwsQSy6Efe4v+09cCznF8vQtdUw89gp/znnPMmoWJJb69G3TWOZ5n9smmUHjsOHjgFdflZIYAC3SxDjQhthXPxIaCPgQuRUNiKIZPHblK/CyHNAZJ9qbAWyQCIPunuX1iPgygvXHTm5QXJcYdSHb2bgUDgicbIcUWJSVWYj96spWysyytBUjX6ND9fsXD/zlY+bgw47M/0DnAO6FdQUOy8zVZ3CivDdf+sTG15EMZou+wPWAGvMlV49himVCe8YASiJh9p7kpLp7oQ99OC7R6SbvMdYVXl1uc+jJQiNHeURyuchsDxk1oE5RlJa2VLo0dq13ZvFxxc4Nl/xF04fb3LSi/x7cTrCHJ9Txj9xqoAzwKbyBkS1qBAYuNnDVa1FeiboR9W6WjgGe1NOAfsu4JfBQrU0r7tNnwruPXsWPuVDVBkZaQ0mEmQI1okeMyewT7Z3r+fO5cgopvOpyqgDgF5OQ7dGOjgHWYRHGt4eeOQK4yfu3HoTzGE7Oi8cx7bSPUGbum6ZSEb//3FQDotTpzAaKdhVZ7J64iZ36qD4LSFglq9q4OA42//hfUzJcs3lNywWWw2Jkvamf6d/kzQAPzm+G8wt0kHFUd+Du9TRyToAnAtGMD7KHF7e5bIiCk290A4OXNuS2sgfzhSL0wWyIlK+ZbTxjYcZFXkCzGzFT9YZk4ldMW6gBuKMBkbPDWKET6178wppUmAPkcmkjYBX11R7SJoEci16TZyH+dCf9G0FRfrH8nQiaTGS6TKVpUjH6jDRhY5APyhB5QK6pJM6H2OpaQf1Kc8GAnrnp6lhATTVU/gLCVizzJ8WqlGqoLn5C2P5KTHxxD4J7Y4Whro1F0g8neaoF0U+a3bvz3mLcq6OvDb7mgg67waIpEZDyYujvI2+6EFVQNcqzolAluJLGnyH8a/8vP6ZkvCp3GMyHl/YFqjgFseqyYve9B4scxjdP813mBIrwo4VSN4QKTsN4sFUrWsUA90KEe5UZydQOGUV6OBMWC36/B2oo1lCaGrrG30/g2fAsM3Sxt5EHaVCH+t7b6e7cToC27xjKdnUbpWzSYDk49zUJsToYexaZfPuqdYSaU/zEgfF3/u95H3u0i3+pk05FPHc1M19nE7jfvg94LQZSxJ3YYDhbrxtT5dUvTGq1egI+MH3r0OhmLLFQmdfSlRPjozft/ekPurJVv3IBa71HmaduwBvMcDArzEuVEeju+ivnZnH3NV0JlQ0xGrtoDjzVzVwRlXazwPRyEsmKzvCza9ySiwR1gHEE1kQ5E1AlTkSslfKcFX63R9wCT4Rtqw4MR+m4jMTT7a54DYKPzkspJl+3i0yulOUMwf48BWavt7rDICdJIrws0kFDKFZUPg4WeDDcI/zYunKEK4AWVtVsLb2V1hp7NYG7vi5Jakz3HSa50J+X6hsXA05nyWL2GEyHMW3E43GLzDx5+aFpQewoQNU/h0jfzIS3XTXPEZISwu3/lCLKZics160C4FmK6l99zym24vB/Qz2yRvwNNySc3NBQ+75FdDoeoKfk7TzSL1FdxVfX7fU67Ijk1s6hXY83+ODT7W/sesk+V3hp3AW+punuWRh2m3BoyJmQgxNmCBUL4dzNAMpxtCuMf+AlmrE5MJ05KI28IB7LqN8B4bJHwY/WFG+M60DIAc5hlDycvoF4r4J+tBCisSU2vqLUFNLIuhRVRp+9Iyu5MTNc/UgoigN/U7cGAZ/XWKt8WqIeTELvCNcX727zu9qojAwpt7tduu2F+iydIBOg1WAJkD6vhs11CI5N5Aul0yWSNz0yxjGeo/nt5LJYU7QUtfKqtJ21ztzDZSdfhrktsWFjcWYUvHdSQuMr7KDFky5FGWzMfH0lMELa5PQUodPeJN+eE/6L0Su2fAMnJrruY+qkHbPvWj0dAdszWHurqqglciI9NS4vwMruYICVWF7iI69G6ZnScGbo2JAfbyUdWhThWB981P+g0CykLC2Cli26k2zW5Rp342wsokp3q8c9aLWpUv49ukA/WvTIQLuEeF2v4tYFx+8aN/jBsZIoIRXFNyjtjwXutgDfKmTdl/urcqqm9Fp0dFcjK2tD8CtHHffI5VHBNVo0ZXvXoKA3fr9sR7AapkMeg3w4C2GXjdwmzkFhtGBOa6kNy6tEGQ1nAD3o2ddm5+IUIrmmueUzSsFzXCUC6ol0a+UPSa4fkAU6G5TVf+DenbTu3ZSe+FLk7OyuD6RpQMPrYs1iFmMn8roZqefBBOvG1W7OdfIv5Y1mtIwX2RO/FZ5HuYhG2fXzjFAmN/rxZxdggMQ3Ubet5T1Aue2r1yrpFJYDMhrGGnX6sRTmTta3lu8YAKxWhPkLG+S/eWMM2D3pquNPkHN8O7fRY/TlY0WTo7FbQ15qhKW+DzSfxPBoNg4Ru5Lh94D1rTWkACTJy98AJntDjPoszhLzOMfAH+LSYhLqIPSHdL+wThiiyIiTgR14QrfLsL10AdWTdba5P5AzQwaRBiJEfX3C9coKu+TLOk3HSfklDh8Drb3sStB2qXGE0/RcOV31NEZIwfR+0tU8yR3eml1AUnVEMfcZvNehmkW+irTLVckOzCLRHFxr+DtcrTTp+sM4H44J4TG+P4BUerPc3+esyvSMXEMUrxsSPRsYBFN9AKm+wa2qtAlmgBAEjoYcrL6gmb0jxNVyzgTgAN4Sc1iAm7muFSYHAXCbEp3uytI4MaRp7vg/rmpmww+exPM5Sv7X98TXPgM/X9C5S2RQv7pzJMxPU+EMdzSDOy711xuezkHuw7DPIBvPjVkSDqIDCOxiz1SImLPV14BTgY55g1Sd3P9yQhhlLlYicLUqlOMjOMCqQ2ZsLYqJ5eon32pQjrk3QHFEx8X1mqMKQQBczeH/IHn0uTSVv61hWyStk1CfOTrlp7qQH9oLkbUWBqoVAwcRuEDQ7yorHhEu8IXcGCJ/nn9mnP0rgk6n4mZ4Cx1OZCdN3AmIhE2K8PwSprJ3jhois50viF1T2hZz/fu9CXXt3Uq4DJ66ILdT3M6bWM2ynAqYoEyqkBgBksQ6wdgewqWQqO8T/tetrAHBGVbzvgUzSZHjIqvrURzPUoan0r05JgHGdMw4dwkYh3uqOWy8tUlAxEeUiZm8QEHlyTjNvYNoiw17LzsXRW9Lain0iFXiMPEFbFpg6pPkvwBFmauisER/qQNCp9hDfdTgxyv/M/KfCFRIF3q5vFVCC1wwewbnulcQNKPAt7fqU+sZ2L5lbHmdlimslxyidoUse537CJWbNk4v7YEjnZ8p9KTv3PPBtLCLuhLNIv1a3i5qX1AM+Z7XMd697c+ZAqcYL5wJbAUX53tSIUEwiHvGURW4qrktD7mVUuZuA3SOEef/Fnd7FtinbnDl3xfY8CGBX47jiMD9eallCP0W4LG0m477DdD/QJR0l/IR5BqQmQTR/4pt0FM2fMvqYg6irpXyToFY48+MvZmWKR+fRmSStEmxOcVa6h+4JrDAgVO+Tfr3folpXYatUGe6I3BL+K1I7npZmBIEBySTYLka3Y4O7ltG83aw8fabaVl9Rt1FfRy4cF1d4pRdSD3moTNz+4tvWTgmB2G/eOnB8NNSgShTkVXLid5muuKexHLScQfqaW1+7b5kp+F0BsfL6DYQNBBvI9HQgA5TSs6VF/x9j96SWK0YRpYodhlLF+t5t8FjtrH9QAhMvD3poBT6AjJMq9eOYErpJlRt3NVIUi/wwlzobyv1hdVe1YGQmVNiG58FN+IPPK9lS+IKasmUbzYW/3IEAW74xT1+JHZF8jHA7kHOLrgmW8q+GLOePLjdURrCN7q1toB/F+Rw6ZmmnAji4cy71YkSj9dNHJFqgLMNJrm8kpf5qsPy0mVNg1q9F2A6jCIn7ObJ+GuTvoL14wy2+u1Sf/2T0qB06c+/8ycQzSOH4S8EvhOC/lpsYpMmZ8SOwz1F+6bv2sOABExeiCRBXsulJql5dTpf9ilJxQZuaKfFQ9sN2eYEVBNjq0KkSgek5VYkL7v+pecc4PP7K2nLQp+iRotSht+m7FwUOydHQR9ZU07j2fD4TfgHXNEoU9tWTd3mmy18WDi/A/toc1ygLgd+dXD9D91h4AsWEiAAYWr6oVkKqfXES7PeqYusjN4ZLDbQeGOh8WqUBmbuj67myb39kN+qZqH/CSIGOHh+p+PcbmKTQXjn2qiO7bpOouvj/7+22wFMQCReGWm+vo94bnWH0wDnO1MtI0EPv/h1LJhK8klQ+BCBryaSlkhUe3nfVGbWC4w8x/0PzH/GH29rlI7mtNZ1PSkleKqFMyR7Y39TJCOdyD+Mvy62Z6ateYevnEj+jLhozWZ4Dwpead5bH99iN1lAEML/WvJESrOzXLFlNybGOU6hBuVE0OI3Tyxp6hOTtIKEoAleWRC263POJDRrf1zx0oSdNR5l8zDFVsk/4G+ji2ALvKLRuDJrRw9jGbqk4bC4HnU4/Ud6kXTtIBZhfRN97tsbFjMRdpdrhO/D3rMjxguWd4VyNP8XGHMBL6j1QiuAK6M3CORTQFnnDwjF4kZ2iMG7pGbgyZj3LJJwbHsHZ7ZuJ36uWNfLZYzb3dLoJF6WAM9vHXO9EdIFENVJMctB6Xsn2RlRbkGMbvDGYJtxuqfgPGNEglV56CsLTLsDx7Kwi7Zkl57m2FHT21/pps1EHn2AU+xpppDUW6BSgabzE7sxhLDhG1B0GCq7FWCtp/D8IRcDEZ4yK1YZPepJYX8gLQY8BmQScHSur3gHWOnhaiRUTThFJBjFTlWu51tEJhK4Eay90QKaAS2TpvjC3uF6kS+XnjJ7JkVIYQ3g5XIUn7HIZfgmiy3PA6Vn79XzsHqT1cZJ3C9xml1gmCWiA6qDBb4sXcZpsj7iqdcdyo/W7ZN30eF3jP9JcSgCu3fl6LiSREV2wy0lEPi8V01Onww9aiaPq13w8541uHsMBEUwW0CQwbmnPLxu/sGzaQmvAolNdXgdBCN17wG3euk72PrQIqFALO7wQQRty9yeYxVsbzVFWOZ3Wag4S1uu+9U6fJxHfyebkrfSrL5XwPMiA11GYWXtwFaj44pFv/9dyP8kDO90Dph712ML3cIO7HF+jxjmLN9wDHc9mRJNNhoO5Y+E0jrEWj2Dv1LADESiJS68amLBLJrSv8d6ZleMGzUtOU8akhK5gRflqQ3X3lkXlzlmXL3NHyyX76VO12wz6DN0PrR9LMV47iq2paiuR7CEN4LrTbb/ymWXgE4qQyGGXg77LjyedzhyK1h4d6BsBb8wvhKLKwWDCaxGo4L0PufBOEkbTjGjIeN3otrnenwbBd9I+ecayYfVbFyU2YMzv8hPtBPQ9Q+fD5dz+TmJ846WMXeh34ibNaL3aC2ZADL2/MfIwem5AZwoxYz+014UbSlg2T8ePRpKejcijiE8eMAT+uEd7k53haxG5eO+ZlbX6+buu+EFHabXDcLEHp2Fm/KLIRvu8zLNiL4NwWXr4yMahpzwemk5ncTaZbG2TsBVqAk8pgPxt+9I8rvwJjVtHAsfrba+ktb0mpIDuUow9Qm4enSOC4Il1jPB40Wt8i1SkPlSs368tB3wv4mUtywXPXymtv+u4a+iu35PbAumXSlYUdrdGunr5qOM7pBMcIsCjHQQ5tkCqAxJ+AMo+uYh5V/UZGf/vCzpTBsIygJdI9ejrDnrrnsEbMcuHuXDSEAF67u5fJ7QljTtnHX9qmf8dHUTi6ZBHK7logFuMgQCea6OV168ZjmwAgY+Z6i71kdlnTCBfKi9OXwrG149b7kMlaTtBouBbg3WFXin82eENJ222UgvZsz2SwglkivKYG0q+kZmBjm7I8HgGaTz5sD3jn2Td+stGQ1OJik+FuQgwWH8XFQq+oQPi00goUJgv6HmCW4xTeAfkQbpPkMqj/pzN+ctz4svp6kEpyF/x+Z545aoq0j9B61Q6+TTIiUMDhHhIEiwS0+QU9A5KylRPSaYcu5TSCuodfnXt6uUcmgqYGPYVue3qUAwE2gJWUBM+QgKB4GHFhnVdv68AmMnjxDV7kkljEvQBfQm4XXu+lOUs2rXXEilv+Qg3odj5OOQL0JV5+v/V8cj5jbNWWmq5dmFJsnLDjnqYzg3qRnSa93V3ZVWCA2d+rkAcZPsEAWJ0Al9XOYV5evet2p5Yyv5AHWmtaQebKB7EFuLxMJUAGwoAINnH82hNUloSrhNrRKiOuDazLrHF332gFS+/3q5yCu6Ion9SoJx0Zgv8kd4gh1DupdfuXg4wxbS4aWyJIkLiH/eftPzPywff+tpJyumh9Q86H5eYbtj/Emi7cyW92VmeB0Q+RtPXPpbCqk2V0bL1gSoMXK6A4ywLSpk/Pi+q+mvKmN5BxLQgNzOxjR958hQmlGMhYRthbI/rvqJJhHQs8wBsr3CTlhjfm11mI4d32ZihO+a7JoOXGlVoeXzIMBEFNS+AbZgR/AS3Nyck5ApmgAAAAAAAA';
  imgElem.alt = 'img';

  const detailContent = document.createElement('div');
  detailContent.classList.add('detail-content');

  const modelContainer = document.createElement('div');
  modelContainer.classList.add('model-container');

  const modelName = document.createElement('h4');
  modelName.classList.add('model-name');
  modelName.textContent = model;
  modelContainer.append(modelName);


  const cardLayerInfoContainer = document.createElement('div');
  cardLayerInfoContainer.classList.add('card-layer-info-container');

  const cardLayerInfoItem = document.createElement('div');
  cardLayerInfoItem.classList.add('card-layer-info-item');

  const infoSpan = document.createElement('span');
  infoSpan.textContent = `${powerKw} kW (${powerPs} KS)`

  const priceContainer = document.createElement('div');
  priceContainer.classList.add('price-container');

  const price = document.createElement('span');
  price.classList.add('car-price');
  price.textContent = `${finalPriceWithTax.min} ${baseCurrencyCodeA}`;

  priceContainer.append(price);
  cardLayerInfoItem.append(infoSpan);
  cardLayerInfoContainer.append(cardLayerInfoItem);
  detailContent.append(modelContainer, cardLayerInfoContainer, priceContainer);

  pictureTag.append(imgElem);
  cardImgContainer.append(pictureTag);

  cardListElement.append(cardImgContainer, detailContent);

  cardList.append(cardListElement);
});
cardContainer.append(cardList);
cardWrapper.append(cardContainer);
document.querySelector('.stock-locator-model-detail-definition-specification.block').appendChild(cardWrapper);

}

async function vehicleFiltersAPI() {
  getStockLocatorVehicles = await getStockLocatorVehiclesData();
  cardTiles();
  console.log(getStockLocatorVehicles);
}
let selectedbolean = false;

async function handleCheckBoxSelectionForSeries() {
  const filterLists = document.querySelectorAll('.filter-list');
  const selectedValues = {};
  filterLists.forEach((filterList) => {
    const filterLabelHeading = filterList.previousElementSibling;
    const checkboxes = filterList.querySelectorAll('.filter-checkbox');
    const headingText = filterLabelHeading.textContent;
    
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', async () => {
        selectedbolean = true;
        console.log(checkbox.checked);
        if (checkbox.checked) {
          if (!filterLabelHeading.classList.contains('is-active')) {
            filterLabelHeading.classList.add('is-active');
          }
          if (!selectedValues[headingText]) {
            selectedValues[headingText] = [];
          }
          if (!selectedValues[headingText].includes(checkbox.id)) {
            selectedValues[headingText].push(checkbox.id);
          }
        } else {
          const index = selectedValues[headingText].indexOf(checkbox.id);
          if (index !== -1) {
            selectedValues[headingText].splice(index, 1);
          }
          // Remove is-active class if no checkbox is selected for this heading
          if (selectedValues[headingText].length === 0) {
            filterLabelHeading.classList.remove('is-active');
          }
        }
        // Update the displayed selected values
        updateSelectedValues(selectedValues);
        vehicleURL = constructVehicleUrl(selectedValues);
        getStockLocatorVehicles = await getStockLocatorVehiclesData(vehicleURL);
        cardTiles();
      });
    });
  });
  console.log(selectedbolean);
}

function constructVehicleUrl(selectedValues) {
  const urlParams = [];
  if (selectedValues.Series && selectedValues.Series.length > 0) {
    urlParams.push(`series=${selectedValues.Series.join(',')}`);
  }
  if (selectedValues.Fuel && selectedValues.Fuel.length > 0) {
    urlParams.push(`fuel=${selectedValues.Fuel.join(',')}`);
  }
  if (selectedValues.DriveType && selectedValues.DriveType.length > 0) {
    urlParams.push(`drive=${selectedValues.DriveType.join(',')}`);
  }

  const fullUrl = `${urlParams.join('&')}`;
  document.querySelector('body').setAttribute('data-vehicle-url', fullUrl);
  return fullUrl;
}

function updateSelectedValues(values) {
  const selectedList = document.querySelector('.series-selected-list');
  selectedList.innerHTML = '';

  let hasSelectedValues = false;

  for (const [heading, valuesArray] of Object.entries(values)) {
      if (valuesArray.length > 0) {
          hasSelectedValues = true;

          valuesArray.forEach((value) => {
              const valueElement = document.createElement('div');
              valueElement.classList.add('selected-filter-value');
              const eleSpan = document.createElement('span');
              eleSpan.textContent = value;
              const cancelElement = document.createElement('a');
              cancelElement.classList.add('cancel-filter');
              valueElement.append(eleSpan, cancelElement);
              selectedList.append(valueElement);
          });
      }
  }

  if (!document.querySelector('.reset-filter') && hasSelectedValues) {
      const resetFilterElement = document.createElement('div');
      resetFilterElement.classList.add('reset-filter');
      const resetSpan = document.createElement('span');
      resetSpan.textContent = 'Reset The filters';
      const resetAnchor = document.createElement('a');
      resetAnchor.classList.add('reset-filter-link');
      resetFilterElement.append(resetSpan, resetAnchor);
      
      selectedList.insertBefore(resetFilterElement, selectedList.firstChild);
      resetFilterElement.addEventListener('click', () => {
        resetAllFilters(values);
    });
    }
  handleCancelSelectedValue(values);
}

function resetAllFilters(values) {
  const checkboxes = document.querySelectorAll('.filter-checkbox');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  const filterLabels = document.querySelectorAll('.filter-label-heading');
  filterLabels.forEach((label) => {
    label.classList.remove('is-active');
  });

  values.DriveType = '';
  values.Fuel = '';
  values.Series = '';

  updateSelectedValues(values);

  currentlyOpenDropdown.style.display = 'none';
  currentlyOpenDropdown.previousElementSibling.classList.remove('show-dropdown');
  vehicleURL = constructVehicleUrl(values);
  getStockLocatorVehiclesData(vehicleURL);
};

function stockLocatorFilterDom(filterData, typeKey, dropDownContainer) {
  const boxContainer = document.createElement('div');
  boxContainer.classList.add('box-container', `${typeKey}-box`);

  const filterContainer = document.createElement('div');
  filterContainer.classList.add('stock-locator-container', `${typeKey}-container`);

  const filterWrapperContainer = document.createElement('div');
  filterWrapperContainer.classList.add('filter-wrapper', `${typeKey}-wrapper`);

  const mobilefilterWrapperLabel = document.createElement('span');
  mobilefilterWrapperLabel.classList.add('mobile-filter-wrapper');
  mobilefilterWrapperLabel.textContent = 'Filter By:';

  const filterHeading = document.createElement('span');
  filterHeading.classList.add('filter-label', `${typeKey}-label`);
  filterHeading.textContent = typeKey.charAt(0).toUpperCase() + typeKey.slice(1);

  const filterLabelHeading = document.createElement('div');
  filterLabelHeading.classList.add('filter-label-heading', `${typeKey}-heading`);
  filterLabelHeading.textContent = typeKey.charAt(0).toUpperCase() + typeKey.slice(1);

  const filterList = document.createElement('ul');
  filterList.classList.add('filter-list', 'dropdown-list-wrapper', `${typeKey}-list`);

  const selectedFilterList = document.createElement('div');
  selectedFilterList.classList.add('selected-filter-list', `${typeKey}-selected-list`);

  filterData.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.classList.add('filter-item', `${typeKey}-item`);

    const checkbox = document.createElement('input');
    checkbox.classList.add(`${typeKey}-checkbox`, 'filter-checkbox');
    checkbox.type = 'checkbox';
    checkbox.id = item.id;

    const label = document.createElement('label');
    label.htmlFor = item.id;
    label.textContent = `${item.label} (${item.count})`;

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    filterList.appendChild(listItem);
  });
  filterContainer.appendChild(filterHeading);
  filterWrapperContainer.appendChild(mobilefilterWrapperLabel);
  filterContainer.appendChild(filterWrapperContainer);
  filterWrapperContainer.appendChild(filterLabelHeading);
  filterWrapperContainer.appendChild(filterList);
  boxContainer.appendChild(filterWrapperContainer);
  filterContainer.appendChild(boxContainer);
  dropDownContainer.append(filterContainer, selectedFilterList);
  document.querySelector('.stock-locator-model-detail-definition-specification').append(dropDownContainer);

  handleMobileSeriesFilter();
  return filterContainer;
}

function sortFilterResponse(data) {
  if (!data) return [];
  return data.sort((a, b) => {
    const idA = a.id.toUpperCase();
    const idB = b.id.toUpperCase();
    if (idA < idB) {
      return -1;
    }
    if (idA > idB) {
      return 1;
    }
    return 0;
  });
}

async function processFilterData(filterData, typeKey, dropDownContainer) {
  if (!filterData) return;
  const sortedFilterData = sortFilterResponse(filterData);
  const filterResponseData = [];

  sortedFilterData.forEach((data) => {
    const responseData = data || '';
    filterResponseData.push(responseData);
  });
  stockLocatorFilterDom(filterResponseData, typeKey, dropDownContainer);
}

function createStockLocatorFilter(filterResponse, dropDownContainer) {
  processFilterData(filterResponse?.series, 'series', dropDownContainer);
  processFilterData(filterResponse?.driveType, 'driveType', dropDownContainer);
  processFilterData(filterResponse?.fuel, 'fuel', dropDownContainer);
  handleToggleFilterDropDown();
}

document.addEventListener('DOMContentLoaded', () => {
  const infoButton = document.querySelector('.description-popup-button');
  const popupText = document.querySelector('.description-popup-container');
  const closeButton = document.querySelector('.description-popup-close-button');
  const toggleButton = document.querySelector('.popup-toggle-button');
  const descriptionPopupDisclaimer = document.querySelector('.description-popup-disclaimer');

  infoButton.addEventListener('click', () => {
    popupText.style.display = 'block';
  });

  closeButton.addEventListener('click', () => {
    popupText.style.display = 'none';
  });

  toggleButton.addEventListener('click', () => {
    if (popupText.classList.contains('expanded')) {
      popupText.classList.remove('expanded');
      descriptionPopupDisclaimer.style.height = '200px';
      toggleButton.textContent = '▼';
    } else {
      popupText.classList.add('expanded');
      toggleButton.textContent = '▲';

      descriptionPopupDisclaimer.style.height = 'max-content';
    }
  });

  // Optional: Click outside to close the popup
  document.addEventListener('click', (event) => {
    if (!popupText.contains(event.target) && !infoButton.contains(event.target)) {
      popupText.style.display = 'none';
    }
  });
});

async function stockLocatorFiltersAPI(dropDownContainer) {
  const stockLocatorFilterResponse = await getStockLocatorFiltersData();

  const stockLocatorFilterData = stockLocatorFilterResponse.data.attributes;

  createStockLocatorFilter(stockLocatorFilterData, dropDownContainer);
}

// Function to handle single select for relevance dropdown
function handleRelevanceSingleSelect() {
  const relevanceDropdown = document.querySelector('.stock-locator-container.relevance .filter-list');
  const items = relevanceDropdown.querySelectorAll('.filter-item-relevance');

  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove('selected')); // Deselect all items
      item.classList.add('selected'); // Select the clicked item
    });
  });
}

// Function to create the relevance dropdown
function createRelevanceDropdown(dropDownContainer) {
  const filterWrapperContent = document.createElement('div');
  filterWrapperContent.classList.add('stock-locator-container', 'relevance');

  const filterWrapper = document.createElement('div');
  filterWrapper.className = 'filter-wrapper';
  const filterLabelHeading = document.createElement('div');
  filterLabelHeading.className = 'filter-label';
  filterLabelHeading.textContent = 'Sort by';
  filterWrapper.appendChild(filterLabelHeading);

  const filterList = document.createElement('div');
  filterList.classList.add('filter-list', 'dropdown-list-wrapper');

  const filterLabelDefault = document.createElement('div');
  filterLabelDefault.className = 'filter-label-heading';
  filterLabelDefault.textContent = 'Relevance';
  filterWrapper.appendChild(filterLabelDefault);
  filterWrapper.appendChild(filterList);

  const sortOptions = [
    { id: 'a-z', text: 'A-Z' },
    { id: 'z-a', text: 'Z-A' }
  ];

  sortOptions.forEach(option => {
    const listItem = document.createElement('div');
    listItem.className = 'filter-item-relevance';

    const label = document.createElement('label');
    label.setAttribute('for', option.id);
    label.textContent = option.text;

    listItem.appendChild(label);
    filterList.appendChild(listItem);
  });

  filterWrapperContent.append(filterWrapper);
  dropDownContainer.append(filterWrapperContent);

  document.querySelector('.stock-locator-model-detail-definition-specification').append(dropDownContainer);
  handleRelevanceSingleSelect();
}

async function getContentFragmentData(disclaimerCFPath, gqlOrigin) {
  const endpointUrl = gqlOrigin + disclaimerGQlEndpoint + disclaimerCFPath.innerText;
  const response = await fetch(endpointUrl);
  return response.json();
}

export default async function decorate(block) {

  const dropDownContainer = document.createElement('div');
  dropDownContainer.classList.add('dropdown-container');

  stockLocatorFiltersAPI(dropDownContainer);

  const props = [...block.children].map((row) => row.firstElementChild);
  const env = document.querySelector('meta[name="env"]').content;
  let publishDomain = '';
  const [disclaimerCF] = props;
  if (env === 'dev') {
    publishDomain = DEV.hostName;
  } else if (env === 'stage') {
    publishDomain = STAGE.hostName;
  } else {
    publishDomain = PROD.hostName;
  }
  block.textContent = '';
  window.gqlOrigin = window.location.hostname.match('^(.*.hlx\\.(page|live))|localhost$') ? publishDomain : '';
  getContentFragmentData(disclaimerCF, window.gqlOrigin).then((response) => {
    const cfData = response?.data;
    console.log(cfData);
    if (cfData) {
      const disclaimerHtml = cfData?.disclaimercfmodelByPath?.item?.disclaimer?.html;
      const disclaimerContent = document.createElement('div');
      disclaimerContent.className = 'disclaimer-content';
      disclaimerContent.innerHTML = disclaimerHtml;
      block.appendChild(disclaimerContent);
    }
  });

  block.textContent = '';
  vehicleFiltersAPI();
  setTimeout(function () {
    createRelevanceDropdown(dropDownContainer);
  }, 500);
}
