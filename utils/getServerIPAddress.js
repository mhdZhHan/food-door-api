const os = require('os')

function getIPAddress() {
    const networkInterfaces = os.networkInterfaces()
    let ipAddress = ''

    // Iterate over network interfaces
    Object.keys(networkInterfaces).forEach(interfaceName => {
        const interfaces = networkInterfaces[interfaceName]
        // Find the first non-internal and IPv4 address
        const interface = interfaces.find(interface => !interface.internal && interface.family === 'IPv4')
        
        if (interface) {
            ipAddress = interface.address
            return
        }
    })

    return ipAddress
}

module.exports = getIPAddress
