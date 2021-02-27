const BASEURL = "http://localhost:3000/toys";

let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const form = document.querySelector(".add-toy-form");
  form.addEventListener("submit", handleSubmit);

  getToys();
});

function getToys() {
  fetch(BASEURL)
    .then((res) => res.json())
    .then((toyData) => toyData.forEach(renderToys));
  // .then(toyData => toyData.forEach((toy) => renderToys(toy)))
}

// async function getToys() {
//   const reponse = await fetch(baseURL)
//   const toyData = await response.json()
//   toyData.forEach(toy => renderToys(toy))
// }

const renderToys = (toy) => {
  let div = document.createElement("div");
  div.className = "card";

  let h2 = document.createElement("h2");
  h2.innerText = toy.name;

  let img = document.createElement("img");
  img.src = toy.image;
  img.className = "toy-avatar";

  // img.setAttribute('src', toy.image)
  // img.setAttribute('class', 'toy-avatar')

  let p = document.createElement("p");
  p.innerText = `${toy.likes} likes`;

  let likeBtn = document.createElement("button");
  likeBtn.className = "like-btn";
  likeBtn.innerText = "Like ❤️";
  likeBtn.id = toy.id;
  likeBtn.addEventListener("click", likedToy);

  div.append(h2, img, p, likeBtn);
  const divCollection = document.getElementById("toy-collection");
  divCollection.appendChild(div);
};

const handleSubmit = (event) => {
  event.preventDefault();
  let nameValue = event.target.name.value;
  let imageValue = event.target.image.value;

  let newToy = {
    name: nameValue,
    image: imageValue,
    likes: 0,
  };

  let reqObj = {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(newToy),
  };

  fetch(BASEURL, reqObj)
    .then((res) => res.json())
    .then(renderToys);
};

function likedToy(event) {
  const id = event.target.id;
  fetch(`${BASEURL}/${id}`)
    .then((res) => res.json())
    .then((toy) => {
      console.log(toy.likes);

      let newLikes = {
        likes: toy.likes + 1,
      };

      let reqObj = {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        body: JSON.stringify(newLikes),
      };

      fetch(`${BASEURL}/${id}`, reqObj)
        .then((res) => res.json())
        .then((res) => {
          const p = event.target.parentElement.getElementsByTagName("p")[0];
          p.innerText = `${res.likes} likes`;
        });
    });
}

// function likeToy(toy,toyCard){

//     let likedToy = {
//       "likes": +toyCard.querySelector('p').innerText + 1
//     }
//     let reqObj = {
//       headers: {"Content-Type": "application/json"},
//       method: "PATCH",
//       body: JSON.stringify(likedToy)
//     }

//     fetch(BASE_URL+toy.id,reqObj).then(res => res.json())
//     .then(updatedToy =>  toyCard.querySelector('p').innerText = updatedToy.likes)

// }
