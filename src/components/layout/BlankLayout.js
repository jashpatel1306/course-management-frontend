import React from 'react'
import View from 'views'

const BlankLayout = props => {
	return (
		<div className="app-layout-blank flex flex-auto flex-col h-[100vh]">
			<View {...props}/>
		</div>
	)
}

export default BlankLayout