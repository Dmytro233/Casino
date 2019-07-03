class User {
  constructor(name, money) {
    this.name = name;
    this.money = money;
  }
  play(gameMachine, moneyToMachine) {
    this.money -= moneyToMachine;
    let game = gameMachine.play(moneyToMachine);
    this.money += game;
  }
}

// -------------------------------------------------------------------------------------------

class SuperAdmin extends User {
  constructor(name, money) {
    super(name, money);
    this.name = name;
    this.money = money;
    this.casinos = [];
  }
  // створити Casino
  createCasino(casinoName) {
    let casino = new Casino(casinoName);
    this.casinos.push(casino);
    return casino;
  }
  // створити GameMachine
  createGameMachine(casino, startMoney) {
    if (this.casinos.indexOf(casino) >= 0) {
      if (this.money >= startMoney) {
        this.money -= startMoney;
        let gameMachine = new GameMachine(startMoney);
        casino.machines.push(gameMachine);
        return gameMachine;
      } else console.error("В адміна немає стільки грошей");
    } else console.error("Даний адмін не має такого Казино");
  }
  // забрати гроші з Casino, по одній ігровій машині починаючи з тої, в якої найбільше грошей
  getMoneyFromCasino(casino, money) {
    let sortGameMachine = casino.machines.sort((a, b) => {
      return b.moneyInMachine - a.moneyInMachine;
    });

    for (let i = 0; i < sortGameMachine.length; i++) {
      if (sortGameMachine[i].getMoney <= money && money > 0) {
        this.money += sortGameMachine[i].getMoney;
        money -= sortGameMachine[i].getMoney;
        sortGameMachine[i].takeMoney(sortGameMachine[i].getMoney);
      } else if (sortGameMachine[i].getMoney > money) {
        this.money += money;
        sortGameMachine[i].takeMoney(money);
        money -= money;
      } else {
        console.log("Забрав всі гроші, що потрібно");
        break;
      }
    }
  }
  // додавати гроші у Casino/GameMachine
  setMoneyToCasino(casino, gameMachine, money) {
    casino.machines[gameMachine].putMoney(money);
  }
  // видалити GameMachine за номером, а гроші розприділити по автоматах в даному казино
  deleteGameMachine(casino, number) {
    let moneyInGameMachine = casino.machines[number].getMoney;
    let moneyWeTake = casino.machines[number].takeMoney(moneyInGameMachine);
    casino.machines.splice(number, 1);
    let moneyToGameMachine = moneyWeTake / casino.machines.length;
    casino.machines.map(el => el.putMoney(moneyToGameMachine));
  }
}

// ----------------------------------------------------------------------------------------------

class Casino {
  constructor(name) {
    this.name = name;
    this.machines = [];
  }

  get getMoney() {
    return this.machines.reduce((acc, val, i) => {
      return acc + this.machines[i].getMoney;
    }, 0);
  }
  get getMachineCount() {
    return this.machines.length;
  }
}

// -----------------------------------------------------------------------------------------------

class GameMachine {
  constructor(money) {
    this.moneyInMachine = money;
  }
  get getMoney() {
    return this.moneyInMachine;
  }
  takeMoney(number) {
    if (this.moneyInMachine >= number) {
      this.moneyInMachine -= number;
      return number;
    } else if (this.moneyInMachine < number) {
      let returnMoney = this.moneyInMachine;
      this.moneyInMachine === 0;
      console.log("Даю, скільки маю)");
      return returnMoney;
    }
  }

  putMoney(number) {
    this.moneyInMachine += number;
  }

  play(number) {
    this.moneyInMachine += number;
    let playNumber1 = parseInt(Math.random() * 10);
    let playNumber2 = parseInt(Math.random() * 10);
    let playNumber3 = parseInt(Math.random() * 10);
    if (
      playNumber1 === playNumber2 ||
      playNumber1 === playNumber3 ||
      playNumber2 === playNumber3
    ) {
      this.moneyInMachine -= number * 2;
      console.log("Congratulations, you win 2x");
      return number * 2;
    } else if (playNumber1 === playNumber2 && playNumber2 === playNumber3) {
      this.moneyInMachine -= number * 3;
      console.log("Congratulations, you win 3x");
      return number * 3;
    } else {
      console.log("Try again");
      return 0;
    }
  }
}

// ----------------------------------------------------------------------------------
