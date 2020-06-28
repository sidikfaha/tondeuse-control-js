/**
 * Id des differentes orientations possibles
 *
 * @type {{S: number, E: number, W: number, N: number}}
 */
const Orientations = {

    "N": 1,
    "E": 2,
    "S": 3,
    "W": 4,

}

/**
 * Id des differentes directions possibles
 *
 * @type {{D: number, G: number}}
 */
const Directions = {

    "D": 1,
    "G": -1,

}

const C_PREFIX = `(console) >> `

class Pelouse {


    constructor(x, y) {
        this.x = x
        this.y = y
    }

}


class Tondeuse {


    /**
     * Creer une nouvelle tondeuse
     * @param {number} x
     * @param {number} y
     * @param {string} orientation - [N,E,S,W]
     * @param {string} cmd - La commande a executer
     * @param {Pelouse} pelouse - La pelouse sur laquelle elle va travailler
     */
    constructor(x, y, orientation, cmd, pelouse) {

        this.x = x
        this.y = y
        this.cmd = cmd
        this.orientationId = Orientations[orientation]
        this.pelouse = pelouse
    }

    /**
     * Changer de directixon
     *
     * @param {string} direction - Le sens de rotation [D => Droite, G => Dauche]
     */
    rorate(direction) {
        const _direction = Directions[direction]
        const _o = this.orientationId


        if (_o === 4 && _direction === 1) {

            this.orientationId = 1

        } else if (_o === 1 && _direction === -1) {

            this.orientationId = 4

        } else {

            if (_direction === 1) {
                this.orientationId++
            } else {
                this.orientationId--
            }

        }

    }

    /**
     * Deplacer la tondeuse dans le sens de sa direction actuelle sans oublier de ne pas deborder la cloture
     */
    move() {
        const pelouseX = this.pelouse.x
        const pelouseY = this.pelouse.y


        switch (this.orientationId) {
            case 1:
                this.y += this.y < pelouseY ? 1 : 0
                break
            case 2:
                this.x += this.x < pelouseX ? 1 : 0
                break
            case 3:
                this.y -= this.y > 0 ? 1 : 0
                break
            case 4:
                this.x -= this.x > 0 ? 1 : 0
                break
        }

    }

    /**
     * Recuperer les coordonnees acutuelles de la tondeuse et son orientation
     * @returns {string}
     */
    getState() {
        return `${this.x} ${this.y} ${getOrientationTxt(this.orientationId)}`
    }

    /**
     * Executer la serie de commandes permettant de controller le tracteur
     */
    run() {
        const _script = this.cmd.split('')

        _script.forEach(s => {
            switch (s) {
                case "D":
                case "G":
                    this.rorate(s)
                    break
                case "A":
                    this.move()
                    break
            }
        })
    }

}

class Runner {

    constructor() {
        this.script = document.querySelector("#script-content").value
        this.console = document.querySelector("#console-content")

        this.init()
    }

    init() {
        const lines = this.script.split(/\r?\n/)
        const pelouseCoord = lines.shift().split(" ")
        const tondeusesDatas = lines
        let listeTondeuses = []

        let pelouse = new Pelouse(pelouseCoord[0], pelouseCoord[1])

        for (let i = 0; i < tondeusesDatas.length; i += 2) {

            console.log(tondeusesDatas)
            const tondCoord = tondeusesDatas[i].split(" ")
            const cmd = tondeusesDatas[i + 1]

            listeTondeuses.push(new Tondeuse(parseInt(tondCoord[0]), parseInt(tondCoord[1]), tondCoord[2], cmd, pelouse))

        }

        this.tondeuses = listeTondeuses;
    }

    exec() {
        const tond = this.tondeuses
        let count = 1

        this.console.innerHTML = ""
        this.w("Execution du script...")
        this.w(`${tond.length} ${tond.length > 1 ? "tondeuses detectees" : "tondeuse detectee"}`)

        tond.forEach(t => {
            this.w(`Demarrage de la tondeuse N° ${count}...`)
            t.run()
            this.w(`<span class="success">Position finale : ${t.getState()}</span>`)
            count++
        })

        this.w("Execution terminee avec succes")

    }

    w(str) {
        this.console.innerHTML += `${C_PREFIX} ${str}<br>`
    }
}

function getOrientationTxt(id) {
    return ["N", "E", "S", "W"][id - 1]
}