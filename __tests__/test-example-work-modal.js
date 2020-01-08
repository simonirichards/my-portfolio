import React from 'react';
import { shallow } from 'enzyme';
import ExampleWorkModal from '../js/example-work-modal';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter()});

const myWork =  [
    {
        'title': "Work Example 1",
        'href': "https://example.com",
        'desc': "This is a description of example 1",
        'image': {
            'desc': "example screenshot of a project involving code",
            'src': "images/example1.png",
            'comment': ""
        }
    },
    {
        'title': "Work Example 2",
        'href': "https://example.com",
        'desc': "This is a description of example 2",
        'image': {
            'desc': "example screenshot of a project involving chemistry",
            'src': "images/example2.png",
            'comment': `"Chemistry” by Surian Soosay is licensed under CC BY 2.0
                        https://www.flickr.com/photos/ssoosay/4097410999`
        }
    }];

describe("ExampleWorkModal Component", () => {
    let component = shallow(<ExampleWorkModal example={myWork[0]}
        open={false}/>);

    let openComponent = shallow(<ExampleWorkModal example={myWork[0]}
        open={true}/>);

    let anchors = component.find("a");

    it("Should contain a single 'a' element", () => {
        // console.log(component.debug());

        expect(anchors.length).toEqual(1);
    });

    it("Should link to the given data passed", () => {
        expect(anchors.prop("href")).toEqual(myWork[0].href);
    });

    it("Should have the modal class set correctly - closed", () => {
        expect(component.find('.background--skyBlue').hasClass('modal--closed')).toBe(true);
    });

    it("Should have theamodel class set correctly - open", () => {
        // console.log(openComponent.debug());
        
        expect(openComponent.find('.background--skyBlue').hasClass('modal--open')).toBe(true);
    });

    it("Should link to the given data passed", () => {
        expect(anchors.prop("href")).toEqual(myWork[0].href);
    });

    it("Testing using the example off the internets", () => {
        const wrapper = shallow(<ExampleWorkModal example={myWork[0]}
            open={true}/>);
            console.log(wrapper.debug());
        expect(wrapper.find('.background--skyBlue').hasClass('modal--open')).toBe(true);
    })

});