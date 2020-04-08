import fs from 'fs'

let group
let subgroup

function getGroupOrSubgroup(line, index) {
    return line.slice(index + 1).toLowerCase().trim()
}

function processLine(line) {
    let indexOfColon

    if (line.length === 0) { return }

    if (line.includes('#group:')) {
        indexOfColon = line.indexOf(':')
        group = getGroupOrSubgroup(line, indexOfColon)
        return
    }

    if (line.includes('#subgroup:')) {
        indexOfColon = line.indexOf(':')
        subgroup = getGroupOrSubgroup(line, indexOfColon)
        return
    }

    const data = line.split(';').map(d => d.trim())

    return [ ...data, group, subgroup ]
}

try {
    console.log('Gathering data...')
    const data = fs.readFileSync('emoji-data.txt', 'UTF-8')
    const lines = data.split(/\r?\n/)
    const response = []
    let index = 1

    lines.forEach(line => {
        const values = processLine(line)
        if (values) {
            response.push({
                id: index,
                code: values[0],
                qualification: values[1],
                icon: values[2],
                name: values[3],
                category: values[4],
                subCategory: values[5],
                modifier: ''
            })

            index += 1
        }
    })

    console.log('Writing data...')
    fs.writeFileSync('emoji.json', JSON.stringify(response))
    console.log('Done')
} catch (err) {
    console.error(err)
}
