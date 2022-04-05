import React from 'react';
import Button from '@material-ui/core/Button';


const App = () => {return (<div><div><h3>File Uploading POC:</h3> <br /></div>
	<input
		type="file"
		style={{ display: 'none' }}
		id="contained-button-file"
	/>
	<label htmlFor="contained-button-file">
		<Button variant="contained" color="primary" component="span">
		Upload
		</Button>
	</label>
	</div>

)};

export default App;
