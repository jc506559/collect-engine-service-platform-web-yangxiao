module.exports = {
	devServer: {
		open: false,
		// https: false,
		proxy: {
			// '/api': {
			// 	// target: 'http://122.114.95.115:8091',
			// 	// target: 'http://122.114.0.88:8093',
			// 	// target: 'https://122.114.0.88:8443',
			// 	// target: 'http://192.168.101.253:8080', // mxy
			// 	target: 'http://116.255.189.120:38081',
			// 	// ws: true,
			// 	// changeOrigin: true
			// },
			'/api': {
				// target: 'http://122.114.95.115:8091',
				// target: 'http://122.114.0.88:8093',
				// target: 'https://122.114.0.88:8443',
				// target: 'http://192.168.101.253:8080', // mxy
				// target: 'http://192.168.1.117:8081',
				// target: 'http://116.255.189.120:38081',
				// target: 'http://192.168.130.210:8080'
				// this
				// target: 'http://192.168.110.171:8081'
				target:'http://116.255.189.120:48081'

				// ws: true,
				// changeOrigin: true
			},
			'/Account': {
				target: 'http://192.168.110.28:80',
				// changeOrigin: true
			},
			'/DataType': {
				target: 'http://192.168.110.28:80',
			}
			// '/api': {
			// 	// target: 'http://122.114.95.115:8091',
			// 	// target: 'http://122.114.0.88:8093',
			// 	// target: 'https://122.114.0.88:8443',
			// 	// target: 'http://192.168.101.253:8080', // mxy
			// 	target: 'https://192.168.1.100:8081/',
			// 	// ws: true,
			// 	// changeOrigin: true
			// }
		}
	}
};
