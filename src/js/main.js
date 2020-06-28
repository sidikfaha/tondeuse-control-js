/**
 * Id des différentes orientations possibles
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
 * Id des différentes directions possibles
 *
 * @type {{D: number, G: number}}
 */
const Directions = {

    "D": 1,
    "G": -1,

}

/**
 * Prefixe de la console
 * @type {string}
 */
const C_PREFIX = `(console) >> `


class Pelouse {


    constructor(x, y) {
        this.x = x
        this.y = y
    }

}


class Tondeuse {


    /**
     * Créer une nouvelle tondeuse
     * @param {number} x
     * @param {number} y
     * @param {string} orientation - [N,E,S,W]
     * @param {string} cmd - La commande à exécuter
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
     * Changer de direction
     *
     * @param {string} direction - Le sens de rotation [D => Droite, G => Dauche]
     */
    rorate(direction) {
        const _direction = Directions[direction]
        const _o = this.orientationId


        if (_o === 4 && _direction === 1) { // Orienter vers N si nous somme à W et que la direction est D

            this.orientationId = 1

        } else if (_o === 1 && _direction === -1) { // Orienter vers W si nous somme à N et que la direction est G

            this.orientationId = 4

        } else { // On passe à l'orientation suivante/precedente si tout est normal

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
        const pelouseX = this.pelouse.x // La limite en abcisse
        const pelouseY = this.pelouse.y // La limite en ordonnée


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
     * Recuperer les coordonnées acutuelles de la tondeuse et son orientation
     * @returns {string}
     */
    getState() {
        return `${this.x} ${this.y} ${getOrientationTxt(this.orientationId)}` // Format de coordonnées x y orientation
    }

    /**
     * Exécuter la serie de commandes permettant de controller la tondeuse
     */
    run() {
        const _script = this.cmd.split('')

        _script.forEach(s => {
            switch (s) {
                case "D":
                case "G":
                    this.rorate(s) // Faire roter si c'est une requête de changement d'orientation
                    break
                case "A":
                    this.move() // Déplacer dans l'autre cas
                    break
            }
        })
    }

}


/**
 * Cette classe se chargera d'interpréter le script et d'afficher les valeurs de retour dans la console
 */
class Runner {

    constructor() {
        this.script = document.querySelector("#script-content").value
        this.console = document.querySelector("#console-content")

        this.init()
    }

    init() {
        const lines = this.script.split(/\r?\n/) // Recuperation des commandes ligne par ligne (dans un tableau)
        const pelouseCoord = lines.shift().split(" ") // Recuperation (sous forme de tableau) de la premiere ligne dediée à la taille de la pelouse et suppression du tableau
        const tondeusesDatas = lines
        let listeTondeuses = [] // TODO: Remplir la liste de tondeuses plus tard en fonctions des lignes du script

        let pelouse = new Pelouse(pelouseCoord[0], pelouseCoord[1]) // Création de la pelouse

        for (let i = 0; i < tondeusesDatas.length; i += 2) {

            const tondCoord = tondeusesDatas[i].split(" ")
            const cmd = tondeusesDatas[i + 1]

            listeTondeuses.push(new Tondeuse(parseInt(tondCoord[0]), parseInt(tondCoord[1]), tondCoord[2], cmd, pelouse))

        }

        this.tondeuses = listeTondeuses;
    }

    exec() {
        const tond = this.tondeuses // Raccourci
        let count = 1

        this.console.innerHTML = ""
        this.w("Exécution du script...")
        this.w(`${tond.length} ${tond.length > 1 ? "tondeuses détectées" : "tondeuse détectée"}`)

        tond.forEach(t => {
            this.w(`Démarrage de la tondeuse N° ${count}...`)
            t.run()
            this.w(`<span class="success">Position finale : ${t.getState()}</span>`)
            count++
        })

        this.w(`<span class="succes">Exécution terminée avec succes</span>`)

    }

    w(str) {
        this.console.innerHTML += `${C_PREFIX} ${str}<br>`
    }
}

/**
 * Obtenir l'orientation en fonction de son identifiant
 * @param {number} id
 * @returns {string}
 */
function getOrientationTxt(id) {
    return ["N", "E", "S", "W"][id - 1]
}