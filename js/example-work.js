import React from 'react';

class ExampleWork extends React.Component {
    render() {
        return (
            
            <section className="section section--alignCentered section--description">
                
                { this.props.work.map( (example, idx) => {
                    return (
                        <ExampleWorkBubble example={example} key={idx} />
                        )
                    })
                }

            </section>

        )
    }
}

class ExampleWorkBubble extends React.Component {
    render() {
        return (
            <div className="section__exampleWrapper">
                <div className="section__example">
                    <img alt={ this.props.example.image.desc }
                        className="section__exampleImage"
                        src={ this.props.example.image.src }/>
                    <dl className="color--cloud">
                        <dt className="section__exampleTitle section__text--centered">
                            { this.props.example.title }
                        </dt>
                        <dd></dd>
                    </dl>
                </div>
            </div>
        )
    }
}

export default ExampleWork
export { ExampleWorkBubble };