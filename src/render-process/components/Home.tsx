import * as React from 'react'
import { Link } from 'react-router-dom'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
require('./Home.scss');

export default class Home extends React.Component {
    render() {
        return (
            <div className='container'>
                <Typography className='title' type='display4'>Steamer</Typography>
                <Typography className='slogan' type='display1'>Faster, Easier & Free</Typography>

                <Link className='enterButton' to='/framework'>
                    <Button raised color='primary'>
                        查看现有脚手架
                    </Button>
                </Link>
            </div>
        );
    }
}
