/* FRACTION
let z = 0;

const fraction = (up, down) => {
  while (up > down) {
    up = up - down;
    z++;
  }

  console.log(`Fraction is ${z} ${up}/${down}`);
}*/

/*  PERCENTAGE
const percentage = (perc, number) => {
  const total = (perc * number) / 100;
  console.log(`${perc}% of ${number} is ${total}.`);
};*/

/* FIND ALL PRIMAL DIVIDERS */

// Check if prime
function isPrime(number) {
  if (number === 2 || number == 1) return true;
  if (number > 2 && number % 2 === 0) return false;
  for (let x = 3; x < number; x += 2) {
    if (number % x === 0) return false;
  }
  return true;
}

// Find lowest divider
function lowestPrimeDivider(number) {
  for (let x = 2; x < number; x++) {
    if (number % x === 0) {
      return x;
    }
  }
}

function findAllPrimalDividers(number) {
  const total = [];
  let sum = number;

  // Condition for while loop
  function isTotalEqualNumber(number) {
    const reducer =
      total.length > 0 ? total.reduce((sum, value) => (sum *= value)) : 0;
    if (reducer === number) {
      return true;
    } else {
      return false;
    }
  }

  while (!isTotalEqualNumber(number)) {
    if (isPrime(sum)) {
      total.push(sum);
    } else {
      total.push(lowestPrimeDivider(sum));
      sum = sum / lowestPrimeDivider(sum);
    }
  }
  console.log(total);
  return total;
}

findAllPrimalDividers(720);
findAllPrimalDividers(800);
