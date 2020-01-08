import React from 'react';
import { shallow } from 'enzyme';
import ExampleWork, { ExampleWorkBubble } from '../js/example-work';
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


describe("ExampleWork Component", () => {
    let component = shallow(<ExampleWork work={myWork}/>);

    it("Should be a 'span' element", () => {
        //console.log(component.debug());

        expect(component.type()).toEqual('span');
    });

    it("Should contain as many children as there are work examples", () => {
        expect(component.find("ExampleWorkBubble").length).toEqual(myWork.length);
    });

    it("Should allow the Modal to open and close", () => {
        component.instance().openModal();
        expect(component.instance().state.modalOpen).toBe(true);
        
        component.instance().closeModal();
        expect(component.instance().state.modalOpen).toBe(false);
    });

});

describe("ExampleWorkBubble component", () => {
    let mockOpenModalFn = jest.fn();
    let component = shallow(<ExampleWorkBubble example={myWork[1]}
        openModal={mockOpenModalFn}/>);
    let images = component.find("img");

    it("Should contain a single image", () => {
        //console.log(component.debug());
        expect(images.length).toEqual(1);
    });

    it("Should have the correct src set correctly", () => {
        expect(images.prop('src')).toEqual(myWork[1].image.src);
    });

    it("Should call the openModal handler when clicked", () => {
        component.find(".section__exampleWrapper").simulate('click');
        expect(mockOpenModalFn).toHaveBeenCalled();
    });
});