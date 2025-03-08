"use strict";
import cloneDeep from "./node_modules/lodash-es/cloneDeep.js";

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [100, 200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  movementsDates: [
    "2020-01-28T09:15:04.904Z",
    "2019-12-23T07:42:02.383Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2024-10-19T10:51:36.790Z",
    "2024-10-21T21:31:17.178Z",
    "2024-10-22T10:51:36.790Z",
    "2024-10-23T10:51:36.790Z",
  ],
  pin: 1111,
};

const newClone = cloneDeep(account1);
console.log(newClone);

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
  ],
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

const current_balance = document.querySelector(".account-bal");
const current_deposit = document.querySelector(".inflow");
const current_withdrawal = document.querySelector(".outflow");
const total_interest = document.querySelector(".interest");
const label_btnEnter = document.querySelector(".btnEnter");
const label_username = document.querySelector(".username");
const label_PIN = document.querySelector(".PIN");
const welcome_message = document.querySelector(".welcomeMessage");
const main_section = document.querySelector(".mainsection");
const containerTransaction = document.querySelector(".transactions");
const transferTo_text = document.querySelector(".transfer_to");
const transfer_amt = document.querySelector(".transfer_amt");
const transfer_btn_enter = document.querySelector(".transferbtn");
const closeAcc_btn_enter = document.querySelector(".closeAccBtn");
const username_btn_enter = document.querySelector(".username_close");
const PIN_btn_enter = document.querySelector(".PIN_close");
const loan_btn_enter = document.querySelector(".loanBtn");
const loan_Amt = document.querySelector(".loanAmt");
const sort_Trans = document.querySelector(".sort");
const movement_value = document.querySelectorAll(".amount");
const timer_val = document.querySelector(".timer");

const welcome = document.querySelector(".welcomeMessage");

let current_date_value = document.querySelector(".cur-date");

let LogInAcc, timerRun;
let sorted = false;
const curr_Date = new Date();

// ******************************* Build Initials ********************************

const buildInitials = function (accs) {
  accs.forEach(
    (acc) =>
      (acc.initials = acc.owner
        .toLowerCase()
        .split(" ")
        .map((el) => el.slice(0, 1))
        .join(""))
  );
};

// ******************************* Transactions Entry ********************************
// movementsDates = LogInAcc.movementsDates;
const addTransactions = function (input, sort = false) {
  containerTransaction.innerHTML = "";

  const input_mov = input.movements;
  const input_val = sort ? input_mov.slice().sort((a, b) => b - a) : input_mov;

  const sort_index = input_mov
    .map((el, index) => ({
      el,
      index,
    }))
    .sort((a, b) => b.el - a.el)
    .map((element) => element.index);

  const input_date = sort
    ? sort_index.map((i) => input.movementsDates[i])
    : input.movementsDates;

  input_val.forEach((element, i) => {
    const transactionType = element > 0 ? "deposit" : "withdrawal";

    const each_date = new Date(input_date[i]);

    const date_diff1 = curr_Date - each_date;
    const date_diff = Math.round(date_diff1 / (1000 * 60 * 60 * 24));

    const htmlcreate = `<div class="movements movements--${transactionType}">
            <p class="transaction-type">${i + 1} ${transactionType}</p>
            <p class="date">${
              date_diff > 5
                ? set_date(each_date)
                : date_diff >= 2
                ? `${date_diff} days ago`
                : date_diff == 0
                ? `Today`
                : `${date_diff} day ago`
            }</p>
            <p class="amount">${element.toFixed(2)} <span>€</span></p>
          </div>`;
    containerTransaction.insertAdjacentHTML("afterbegin", htmlcreate);
  });
};

// ******** Timer Set **************************************************************

const setTimer = function () {
  let time = 60;
  console.log(timer_val.textContent);

  const tick = function () {
    let mins = String(Math.trunc(time / 60)).padStart(2, "0");
    let secs = String(Math.trunc(time % 60)).padStart(2, "0");
    timer_val.textContent = `${mins}:${secs}`;

    if (time === 0) {
      clearInterval(timerRun);
      welcome.textContent = "Please log in to get started";
      main_section.style.opacity = 0;
    }

    time--;
  };

  tick();
  const timerRun = setInterval(tick, 1000);
  console.log(`timerRun is ${timerRun}`);
  return timerRun;
};

function startTimer() {
  if (timerRun) {
    clearInterval(timerRun);
  }
  timerRun = setTimer();
}

// ************* Track User Activity **************************************************************

function userActivityHandle() {
  console.log(`User is Active`);
  startTimer();
}

document.addEventListener("mousemove", userActivityHandle);
document.addEventListener("mousedown", userActivityHandle);
document.addEventListener("wheel", userActivityHandle);

// Detect keyboard events
document.addEventListener("keydown", userActivityHandle);

// Detect touch events (for mobile devices)
document.addEventListener("touchstart", userActivityHandle);

// ******** Practice Methods **************************************************************
// const JuliaData = [3, 5, 2, 12, 7];
// const KateData = [4, 1, 15, 8, 3];

// let max = JuliaData.reduce((acc, cur) => {
//   if (acc > cur) {
//     return acc;
//   } else return cur;
// }, JuliaData[0]);

// const removeCats = function (input_data) {
//   const input_JuliaData = input_data.slice();
//   return input_JuliaData.slice(1, input_JuliaData.length - 2);
// };

// const correctedJuliaData = removeCats(JuliaData);
// // console.log(correctedJuliaData);

// const DogOrPuppy = function (input_array) {
//   input_array.forEach((data, i) => {
//     const displayData =
//       data > 2
//         ? `"It is a dog which is ${data} years old"`
//         : `"It is a puppy which is ${data} years old"`;
//     console.log(displayData);
//   });
// };

// DogOrPuppy(correctedJuliaData);
// DogOrPuppy(KateData);
// const eurUSD = 2;

// const convertToUSD = JuliaData.map((el) => el * eurUSD);

// // console.log(JuliaData);
// // console.log(convertToUSD);

// // console.log(account3.owner.toLowerCase());

// // console.log(buildInitials(accounts));
// // console.log(account1);

// const withdrawal = account3.movements.filter((el) => el < 0);

// // console.log(withdrawal);
// const sum = account3.movements.reduce((acc, curr, i, arr) => acc + curr, 0);
// // console.log(`sum is ${sum}`);

// for (let acc of accounts) {
//   const account = acc.owner === "Jessica Davis" && acc;
//   console.log(account);
// }

// const curr = new Map([
//   ["USD", "Dollars"],
//   ["INR", "Rupees"],
//   ["EUR", "Euro"],
// ]);

// curr.forEach(function (value, key, map) {
//   console.log(`${key}:${value}`);
// });

// const x = Array.from({ length: 100 }, () => Math.floor(Math.random() * 101));
// console.log(`${x}`);
// console.log(typeof x);

// const x = Array.from(movement_value, (el) =>
//   Number(el.textContent.replace("$", ""))
// );
// console.log(x);

// const bankDep = accounts
//   .map((acc) => acc.movements)
//   .flat()
//   .filter((el) => el > 0)
//   .reduce((acc, cur) => acc + cur, 0);
// console.log(bankDep);

// const bankDep1 = accounts.flatMap((acc) => acc.movements)
// .reduce((acc, cur) => (cur > 1000 ? acc + 1 : acc), 0);
// console.log(bankDep1);

// const bankDep = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce(
//     (acc, cur) => {
//       cur > 0 ? (acc.deposits += cur) : (acc.withdrawals += cur);
//       return acc;
//     },
//     {
//       deposits: 0,
//       withdrawals: 0,
//     }
//   );
// console.log(bankDep);

// setTimeout(() => {
//   console.log("Hello World");
// }, 1000);

// const intrvl = setInterval(() => {
//   console.log(`Hi Again!`);
// }, 3000);

// setTimeout(() => {
//   clearInterval(intrvl); // Stops the interval after 5 seconds
//   console.log("Interval stopped.");
// }, 10000);

// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:*/
const dogs = [
  { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
  { weight: 8, curFood: 200, owners: ["Matilda"] },
  { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
  { weight: 32, curFood: 340, owners: ["Michael"] },
];

const Food_Portion_calc = function (dogData) {
  dogData.forEach(
    (dog) => (dog.recommendedFood = Math.ceil(dog.weight ** 0.75 * 28))
  );
};

Food_Portion_calc(dogs);

const Sarah_dog = dogs.find((dog) => dog.owners.includes("Sarah"));
console.log(
  `Sarah's dog is eating ${
    Sarah_dog.curFood > Sarah_dog.recommendedFood ? "more" : "less"
  }`
);

// console.log(Sarah_dog);
const ownersEatTooMuch = dogs
  .filter((dog) => dog.curFood > dog.recommendedFood)
  .map((el) => el.owners)
  .flat();
// console.log(ownersEatTooMuch);

// console.log(`${ownersEatTooMuch.join(" ")}'s dogs are eating too much`);

const Dog_val = dogs.some((dog) => dog.curFood == dog.recommendedFood);
// console.log(`${Dog_val ? "there is" : "there isn't"}`);

const DogsEatingOkay = (dog) =>
  dog.curFood > dog.recommendedFood * 0.9 &&
  dog.curFood < dog.recommendedFood * 1.1;

// console.log(dogs.some(DogsEatingOkay));
// console.log(dogs.filter(DogsEatingOkay));

// const owner = Array.from(ownersEatTooMuch, (x) => x.owners).flat();
// console.log(owner);

// const convertTitleCase = function (title) {
//   const exceptions = ["a", "an", "the"];

//   const newtitle = title
//     .toLowerCase()
//     .split(" ")
//     .map((el) =>
//       exceptions.includes(el) ? el : el[0].toUpperCase() + el.slice(1)
//     )
//     .join(" ");
//   console.log(newtitle);
// };

// convertTitleCase("thIs iS A gOOd eXamPle");

const recFoodPortionDogs = dogs.map((dog) => dog.recommendedFood);
console.log(recFoodPortionDogs);
const newDogsArray = recFoodPortionDogs.slice().sort((a, b) => a - b);
console.log(newDogsArray);

// ************************************* Coding challenge2 ***************************************
// TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
// TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

const CalcHumanAges = function (input_arr) {
  const newArr = input_arr.map((el) => (el <= 2 ? 2 * el : 16 + el * 4));
  console.log(newArr);
  const filteredArr = newArr.filter((el) => el >= 18);
  console.log(filteredArr);
  const sumAgeDogs = filteredArr.reduce((acc, cur) => acc + cur, 0);
  console.log(`Average age of dogs is ${sumAgeDogs / filteredArr.length}`);
};

// let ageDogs = CalcHumanAges([5, 2, 4, 1, 15, 8, 3]);
// console.log(ageDogs);

// ************************************ Calculate Balance ***********************************************

const calc_bal = function (input_acc) {
  const curr_balance = input_acc.movements.reduce((acc, curr) => acc + curr, 0);
  input_acc.curBal = curr_balance;
  console.log(input_acc);
  current_balance.textContent = `${curr_balance.toFixed(2)} €`;
};

// ****************************** Calculate Deposit *****************************************

const calc_deposit = function (input_acc) {
  const deposit_sum = input_acc.movements
    .filter((el) => el > 0)
    .reduce((acc, cur, i, arr) => acc + cur, 0);
  current_deposit.textContent = `${deposit_sum.toFixed(2)}€`;
};

// ****************************** Calculate Withdrawal *****************************************

const calc_withdrawal = function (input_acc) {
  const withdrwal_sum = input_acc.movements
    .filter((el) => el < 0)
    .reduce((acc, cur, i, arr) => acc + cur, 0);
  current_withdrawal.textContent = `${Math.abs(withdrwal_sum).toFixed(2)}€`;
};

// ****************************** Calculate Interest *******************************

const calc_interest = function (input_acc) {
  const interest_amt = input_acc.movements
    .filter((el) => el > 0)
    .map((el) => el * (input_acc.interestRate / 100))
    .filter((el) => el >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  total_interest.textContent = `${interest_amt.toFixed(2)}€`;
};

// *********************** Find out LoggedIn Account **************************

const loggedIn_acc = function () {
  let account = accounts.find((acc) => acc.initials === label_username.value);
  console.log(`Inside login function ${account}`);
  return account;
};

// ******************************** Setting dates **********************************

const set_date = function (currDate, flag) {
  let day = `${currDate.getDate()}`.padStart(2, "0");
  let month = `${currDate.getMonth() + 1}`.padStart(2, "0");
  let year = currDate.getFullYear();
  let hours = `${currDate.getHours()}`.padStart(2, "0");
  let mins = `${currDate.getMinutes()}`.padStart(2, "0");

  if (flag) {
    current_date_value.textContent = `${day}/${month}/${year}`;
  } else {
    const date_formatted = `${day}/${month}/${year}`;
    return date_formatted;
  }
};

// ******************************** Update UI **********************************

const updateUI = function () {
  // addTransactions(LogInAcc.movements, false);
  addTransactions(LogInAcc, false);
  calc_bal(LogInAcc);
  calc_deposit(LogInAcc);
  calc_withdrawal(LogInAcc);
  calc_interest(LogInAcc);
  set_date(curr_Date, true);
  startTimer();
};

// ******************************** Implementing Login **********************************
label_btnEnter.addEventListener("click", function () {
  buildInitials(accounts);
  LogInAcc = loggedIn_acc();
  console.log(LogInAcc);
  if (LogInAcc?.pin === Number(label_PIN.value)) {
    welcome_message.textContent = `Welcome back, ${
      LogInAcc.owner.split(" ")[0]
    }`;
    main_section.style.opacity = 100;
    updateUI();
    label_username.value = label_PIN.value = "";
  } else console.log(`Not logged in`);
});

// ******************************* Loan Account **********************************

loan_btn_enter.addEventListener("click", function (e) {
  e.preventDefault();
  const loanRequest = +Math.floor(loan_Amt.value);
  // console.log(loanRequest);
  // console.log(`loanAmount is ${loanAmount}`);
  const depFilter = LogInAcc.movements.find((mov) => mov > 0.1 * loanRequest);
  console.log(`depFilter is ${depFilter}`);
  if (loanRequest > 0 && depFilter) {
    LogInAcc.movements.push(loanRequest);
    LogInAcc.movementsDates.push(new Date().toISOString());
  }
  updateUI();
  loan_Amt.value = "";
});

// ******************************* Implementing Transfers **********************************

transfer_btn_enter.addEventListener("click", function (e) {
  e.preventDefault();
  const initialsRecieverAcc = transferTo_text.value;
  const transferAmount = +transfer_amt.value;
  // console.log(initialsRecieverAcc, transferAmount);
  const tranferToAcc = accounts.find(
    (acc) => acc.initials === initialsRecieverAcc
  );
  if (
    transferAmount > 0 &&
    LogInAcc.curBal > transferAmount &&
    LogInAcc.initials !== initialsRecieverAcc &&
    tranferToAcc != null
  ) {
    tranferToAcc.movements.push(transferAmount);
    tranferToAcc.movementsDates.push(new Date().toISOString());
    LogInAcc.movements.push(-transferAmount);
    LogInAcc.movementsDates.push(new Date().toISOString());
    updateUI();
  } else {
    console.log(`Balance not sufficient`);
  }
  transferTo_text.value = transfer_amt.value = "";
});

// ******************************* Close Account **********************************

closeAcc_btn_enter.addEventListener("click", function (e) {
  e.preventDefault();
  let closeAccUser = username_btn_enter.value;
  let closeAccPIN = +PIN_btn_enter.value;
  const acc = LogInAcc;
  console.log(acc);
  if (acc.initials === closeAccUser && acc.pin === closeAccPIN) {
    console.log(`Inside loop`);
    console.log(typeof acc, typeof closeAccUser);
    const delAccIndex = accounts.findIndex(
      (acc) => acc.initials === closeAccUser
    );
    console.log(delAccIndex);
    accounts.splice(delAccIndex, 1);
    console.log(`Your account has been deleted!`);
  }
  username_btn_enter.value = PIN_btn_enter.value = "";
  console.log(accounts);
});

// ******************************** Implementing Map and FlatMap *******************************************

// const transactions = accounts
//   .map((el) => el.movements)
//   .flat()
//   .reduce((acc, cur) => acc + cur, 0);

const transactions = accounts
  .flatMap((el) => el.movements)
  .reduce((acc, cur) => acc + cur, 0);
// console.log(transactions);

// ******************************** Implementing Sort *******************************************

sort_Trans.addEventListener("click", function (e) {
  e.preventDefault();
  addTransactions(LogInAcc, !sorted);
  sorted = !sorted;
});

let color_flag = false;

const alternate_row_color = function (color_flag) {
  console.log("Entering function");
  const mov = document.querySelectorAll(".movements");
  console.log(mov);
  mov.forEach(function (el, i) {
    if (color_flag) {
      i % 2 == 0
        ? (el.style.backgroundColor = "#edf2ff")
        : (el.style.backgroundColor = "#dbe4ff");
    } else {
      el.style.backgroundColor = "white";
    }
  });
};

// // current_balance.addEventListener("click", alternate_row_color(color_flag));
// current_balance.addEventListener("click", function () {
//   console.log("Im a function");
// });

current_balance.addEventListener("click", function (e) {
  e.preventDefault();
  alternate_row_color(!color_flag);
  color_flag = !color_flag;
});

// ******************************** Setting Dates *******************************************

let obj = {
  dates: ["2024-10-23", "2023-05-15", "2022-08-10"],
  values: [30, 20, 10],
};

// Step 1: Get the indices of the sorted array
let sortedIndices = [...obj.dates]
  .map((date, index) => ({ date, index })) // Create an array of objects containing date and original index
  .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort based on the dates
  .map((item) => item.index); // Extract the sorted indices

console.log(sortedIndices);

// Step 2: Reorder both the arrays based on the sorted indices
obj.dates = sortedIndices.map((i) => obj.dates[i]);
obj.values = sortedIndices.map((i) => obj.values[i]);

console.log(obj);
