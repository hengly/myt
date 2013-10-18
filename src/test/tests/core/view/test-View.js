module('View');

test("Create and destroy a view", function() {
    var div = document.createElement('div');
    div.style.position = 'absolute';
    
    ok(div.id == null || div.id == '', "Div should not have an id yet." + div.id);
    
    var bdy = myt.getElement();
    bdy.appendChild(div);
    
    var divId = 'testDivId';
    var v = new myt.View(div, {domId:divId}, [myt.RootView]);
    
    ok(v != null, "New view exists");
    ok(div.model === v, "Model for div should be the new view.");
    ok(v.domElement === div, "domElement for view should be the div.");
    ok(v.deStyle === div.style, "deStyle for view should be the style from the div.");
    
    ok(v.domId === divId, "domId for view should have been set.");
    ok(v.domId === div.id, "domId and div.id should be equal.");
    
    var divFromDoc = document.getElementById(divId);
    ok(div === divFromDoc, "Div obtained from document should be the same div.");
    
    // Destroy it
    v.destroy();
    
    ok(v.destroyed === true, "The destroyed property of the new view should be true.");
    ok(v.domElement == null, "The domElement reference should not exists anymore.");
    ok(v.deStyle == null, "The deStyle reference should not exists anymore.");
    
    var divFromDocAgain = document.getElementById(divId);
    ok(divFromDocAgain == null, "Div obtained from document after destroy should not exist.");
});

test("Create and destroy a view with keepDomElementWhenDestroyed set to true.", function() {
    var div = document.createElement('div');
    div.style.position = 'absolute';
    
    ok(div.id == null || div.id == '', "Div should not have an id yet." + div.id);
    
    var bdy = myt.getElement();
    bdy.appendChild(div);
    
    var divId = 'testDivId';
    var v = new myt.View(div, {domId:divId, keepDomElementWhenDestroyed:true}, [myt.RootView]);
    
    ok(v != null, "New view exists");
    ok(div.model === v, "Model for div should be the new view.");
    ok(v.domElement === div, "domElement for view should be the div.");
    ok(v.deStyle === div.style, "deStyle for view should be the style from the div.");
    
    ok(v.domId === divId, "domId for view should have been set.");
    ok(v.domId === div.id, "domId and div.id should be equal.");
    
    var divFromDoc = document.getElementById(divId);
    ok(div === divFromDoc, "Div obtained from document should be the same div.");
    
    // Destroy it
    v.destroy();
    
    ok(v.destroyed === true, "The destroyed property of the new view should be true.");
    ok(v.domElement == null, "The domElement reference should not exists anymore.");
    ok(v.deStyle == null, "The deStyle reference should not exists anymore.");
    
    var divFromDocAgain = document.getElementById(divId);
    ok(div === divFromDoc, "Div obtained from document after destroy should still exist.");
    
    // Cleanup
    div.parentNode.removeChild(div);
});

test("Create a view without providing a div.", function() {
    var v = new myt.View(null, {}, [myt.RootView]);
    
    ok(v.domElement != null, "A dom element should exist for the new root view.");
    ok(v.domElement.parentNode.nodeName === 'BODY', "The dom element should be a child of the body.");
    
    v.destroy();
});

test("View position, size and clip.", function() {
    var v = new myt.View(null, {x:10, y:20, width:30, height:40}, [myt.RootView]);
    
    ok(v.x === 10, "View should have an x of 10.");
    ok(v.get('x') === 10, "View getter for x should return 10");
    ok(v.deStyle.left === '10px', "domElement.style.left should be 10px.");
    ok(v.domElement.offsetLeft === 10, "Dom element should have an offsetLeft of 10.");
    
    ok(v.y === 20, "View should have an y of 20.");
    ok(v.get('y') === 20, "View getter for y should return 20");
    ok(v.deStyle.top === '20px', "domElement.style.top should be 20px.");
    ok(v.domElement.offsetTop === 20, "Dom element should have an offsetTop of 20.");
    
    ok(v.width === 30, "View should have a width of 30.");
    ok(v.get('width') === 30, "View getter for width should return 30");
    ok(v.deStyle.width === '30px', "domElement.style.width should be 30px.");
    ok(v.domElement.offsetWidth === 30, "Dom element should have an offsetWidth of 30.");
    
    ok(v.height === 40, "View should have an height of 40.");
    ok(v.get('height') === 40, "View getter for height should return 40");
    ok(v.deStyle.height === '40px', "domElement.style.height should be 40px.");
    ok(v.domElement.offsetHeight === 40, "Dom element should have an offsetHeight of 40.");
    
    // Should be no clip
    ok(v.deStyle.clip === '', "No clip is applied so none should exist.");
    ok(v.clip === false, "Clip should be initially false.");
    v.setClip(true);
    ok(v.deStyle.clip === 'rect(0px 30px 40px 0px)' || 
        v.deStyle.clip === 'rect(0px, 30px, 40px, 0px)', 
        "True clip so it should be a rect: " + v.deStyle.clip
    ); // commas are in firefox.
    v.setClip(false);
    ok(v.deStyle.clip === 'auto', "False clip applied so it should now be auto.");
    
    // Bounding client rect
    var bounds = v.domElement.getBoundingClientRect();
    ok(bounds.left === 10, "Bounding client rect should have a left of 10.");
    ok(bounds.top === 20, "Bounding client rect should have a top of 20.");
    ok(bounds.width === 30, "Bounding client rect should have a width of 30.");
    ok(bounds.height === 40, "Bounding client rect should have a height of 40.");
    
    // Set values
    v.setX(5);
    ok(v.domElement.offsetLeft === 5, "Dom element should have an offsetLeft of 5.");
    
    v.setY(15);
    ok(v.domElement.offsetTop === 15, "Dom element should have an offsetTop of 5.");
    
    v.setWidth(25);
    ok(v.domElement.offsetWidth === 25, "Dom element should have an offsetWidth of 5.");
    
    v.setHeight(35);
    ok(v.domElement.offsetHeight === 35, "Dom element should have an offsetHeight of 5.");
    
    // Negative widths and heights
    v.setWidth(-10);
    ok(v.width === 0, "View should have an width of 0.");
    ok(v.domElement.offsetWidth === 0, "Dom element should have an offsetWidth of 0.");
    
    v.setHeight(-20);
    ok(v.height === 0, "View should have an height of 0.");
    ok(v.domElement.offsetHeight === 0, "Dom element should have an offsetHeight of 0.");
    
    // Destroy it
    v.destroy();
});

test("View alignment", function() {
    var divId = 'testDivId';
    var v = new myt.View(null, {x:0, y:0, width:100, height:50}, [myt.RootView]);
    var child1 = new myt.View(v, {width:10, height:5, domId:divId});
    var child2 = new myt.View(v, {width:10, height:5, align:'center'});
    var child3 = new myt.View(v, {width:10, height:5, valign:'middle'});
    
    ok(child1.x === 0, "View should have an x of 0.");
    ok(child1.domElement.offsetLeft === 0, "Dom element should have an offsetLeft of 0.");
    ok(child1.y === 0, "View should have an y of 0.");
    ok(child1.domElement.offsetTop === 0, "Dom element should have an offsetTop of 0.");
    
    ok(child2.x === 45, "View should have an x of 45.");
    ok(child2.domElement.offsetLeft === 45, "Dom element should have an offsetLeft of 45.");
    ok(child2.y === 0, "View should have an y of 0.");
    ok(child2.domElement.offsetTop === 0, "Dom element should have an offsetTop of 0.");
    
    ok(child3.y === 22.5, "Valign middle view should have an y of 22.");
    ok(child3.domElement.offsetTop === 23, "Valign middle dom element should have an offsetTop of 22.");
    var bounds = child3.domElement.getBoundingClientRect();
    console.log(bounds);
    ok(bounds.top === 22.5, "Bounding client rect should have a top of 22.5: " + bounds.top);
    
    // resize parent
    v.setWidth(200);
    
    ok(child2.x === 95, "View should have an x of 95.");
    ok(child2.domElement.offsetLeft === 95, "Dom element should have an offsetLeft of 95.");
    
    // Change alignment
    child2.setAlign('right');
    
    ok(child2.x === 190, "View should have an x of 190 after right alignment.");
    ok(child2.domElement.offsetLeft === 190, "Dom element should have an offsetLeft of 190 after right alignment.");
    
    child2.setWidth('20');
    
    ok(child2.x === 180, "View should have an x of 180 after width change.");
    ok(child2.domElement.offsetLeft === 180, "Dom element should have an offsetLeft of 180 after width change.");
    
    child2.setAlign('left');
    
    ok(child2.x === 0, "View should have an x of 0 after left alignment.");
    ok(child2.domElement.offsetLeft === 0, "Dom element should have an offsetLeft of 0 after left alignment.");
    
    // resize parent
    v.setHeight(100);
    
    ok(child3.y === 47.5, "View should have a y of 47.5.");
    ok(child3.domElement.offsetTop === 48, "Dom element should have an offsetTop of 48.");
    
    // Change valign
    child3.setValign('bottom');
    
    ok(child3.y === 95, "View should have a y of 95 after bottom alignment.");
    ok(child3.domElement.offsetTop === 95, "Dom element should have an offsetLeft of 95 after bottom alignment.");
    
    child3.setHeight('10');
    
    ok(child3.y === 90, "View should have an y of 90 after height change.");
    ok(child3.domElement.offsetTop === 90, "Dom element should have an offsetTop of 90 after height change.");
    
    child3.setValign('top');
    
    ok(child3.y === 0, "View should have a y of 0 after top alignment.");
    ok(child3.domElement.offsetTop === 0, "Dom element should have an offsetTop of 0 after top alignment.");
    
    // Remove alignment
    child2.setAlign('center');
    child2.setAlign('');
    v.setWidth(160);
    ok(child2.x === 90, "View should still have a y of 90 after removing align.");
    ok(child2.domElement.offsetLeft === 90, "Dom element should still have an offsetLeft of 90 after removing align.");
    
    // Remove vertical alignment
    child3.setValign('middle');
    child3.setValign('');
    v.setHeight(80);
    ok(child3.y === 45, "View should still have a y of 45 after removing valign.");
    ok(child3.domElement.offsetTop === 45, "Dom element should still have an offsetTop of 45 after removing valign.");
    
    // Destroy it
    v.destroy();
    
    var divFromDocAgain = document.getElementById(divId);
    ok(divFromDocAgain == null, "Div obtained from document after destroy should not exist.");
});

test("Test getSubviews, getSiblingViews, getLayouts", function() {
    var v = new myt.View(null, {x:0, y:0, width:100, height:50}, [myt.RootView]);
    
    ok(v.subviews === undefined, "Subviews should begin as undefined.");
    ok(v.getSubviews().length === 0, "Subviews should get lazy instantiated.");
    ok(v.subviews.length === 0, "Subviews should now be defined.");
    
    ok(v.layouts === undefined, "Layouts should begin as undefined.");
    ok(v.getLayouts().length === 0, "Layouts should get lazy instantiated.");
    ok(v.layouts.length === 0, "Layouts should now be defined.");
    
    var child1 = new myt.View(v);
    var child2 = new myt.View(v);
    var child3 = new myt.View(v);
    
    var layout1 = new myt.ConstantLayout(v);
    var layout2 = new myt.ConstantLayout(v);
    
    ok(v.getSubviews().length === 3, "Root view should have 3 subviews.");
    ok(v.getLayouts().length === 2, "Root view should have 2 layouts.");
    
    var siblings = child2.getSiblingViews();
    ok(siblings.length === 2, "Child should have 2 siblings.");
    ok(siblings[0] === child1, "First sibling should be the first child added.");
    ok(siblings[1] === child3, "Second sibling should be the last child added.");
    
    // Destroy it
    v.destroy();
});

test("Outlines", function() {
    var v = new myt.View(null, {x:0, y:0, width:100, height:100}, [myt.RootView]);
    
    var v1 = new myt.View(v, {width:10, height:10});
    
    ok(v1.outlineWidth === undefined, "No outlineWidth defined on view yet.");
    ok(v1.deStyle.outlineWidth === '', "No outlineWidth defined on dom element yet.");
    
    ok(v1.outlineStyle === undefined, "No outlineStyle defined on view yet.");
    ok(v1.deStyle.outlineStyle === '', "No outlineStyle defined on dom element yet.");
    
    ok(v1.outlineColor === undefined, "No outlineColor defined on view yet.");
    ok(v1.deStyle.outlineColor === '', "No outlineColor defined on dom element yet.");
    
    v1.setOutlineWidth(5);
    
    ok(v1.outlineWidth === 5, "Outline width is now 5.");
    ok(v1.deStyle.outlineWidth === '5px', "Outline width is 5px.");
    
    v1.setOutlineStyle('solid');
    
    ok(v1.outlineStyle === 'solid', "Outline style is now solid.");
    ok(v1.deStyle.outlineStyle === 'solid', "Outline style is solid.");
    
    v1.setOutlineColor('#ffffff');
    
    ok(v1.outlineColor === '#ffffff', "Outline color is now #ffffff.");
    ok(v1.deStyle.outlineColor === 'rgb(255, 255, 255)', "Outline color is now rgb(255, 255, 255).");
    
    v1.setOutline(null);
    
    ok(v1.outlineWidth === 0, "Outline width is now 0.");
    ok(v1.deStyle.outlineWidth === '0px', "Outline width is now 0px.");
    
    ok(v1.outlineStyle === 'none', "Outline style is now none.");
    ok(v1.deStyle.outlineStyle === 'none', "Outline style is now none.");
    
    ok(v1.outlineColor === '#000000', "Outline color is now #000000.");
    ok(v1.deStyle.outlineColor === 'rgb(0, 0, 0)', "Outline color is now rgb(0, 0, 0).");
    
    v1.setOutline([2, 'dotted', '#ffffff']);
    
    ok(v1.outlineWidth === 2, "Outline width is now 2.");
    ok(v1.deStyle.outlineWidth === '2px', "Outline width is now 2px.");
    
    ok(v1.outlineStyle === 'dotted', "Outline style is now dotted.");
    ok(v1.deStyle.outlineStyle === 'dotted', "Outline style is now dotted.");
    
    ok(v1.outlineColor === '#ffffff', "Outline color is now #ffffff.");
    ok(v1.deStyle.outlineColor === 'rgb(255, 255, 255)', "Outline color is now rgb(255, 255, 255).");
    
    v1.setOutlineWidth();
    
    ok(v1.outlineWidth === 0, "Outline width is now 0.");
    ok(v1.deStyle.outlineWidth === '0px', "Outline width is now 0px.");
    
    v1.setOutlineStyle(false);
    
    ok(v1.outlineStyle === 'none', "Outline style is now none.");
    ok(v1.deStyle.outlineStyle === 'none', "Outline style is now none.");
    
    v1.setOutlineColor(0);
    
    ok(v1.outlineColor === '#000000', "Outline color is now #000000.");
    ok(v1.deStyle.outlineColor === 'rgb(0, 0, 0)', "Outline color is now rgb(0, 0, 0).");
    
    v.destroy();
});

test("Borders", function() {
    var v = new myt.View(null, {x:0, y:0, width:100, height:100}, [myt.RootView]);
    
    var v1 = new myt.View(v, {width:10, height:10});
    
    ok(v1.borderWidth === undefined, "No borderWidth defined on view yet.");
    ok(v1.deStyle.borderWidth === '', "No borderWidth defined on dom element yet.");
    
    ok(v1.borderStyle === undefined, "No borderStyle defined on view yet.");
    ok(v1.deStyle.borderStyle === '', "No borderStyle defined on dom element yet.");
    
    ok(v1.borderColor === undefined, "No borderColor defined on view yet.");
    ok(v1.deStyle.borderColor === '', "No borderColor defined on dom element yet.");
    
    v1.setBorderWidth(5);
    
    ok(v1.borderWidth === 5, "Border width is now 5.");
    ok(v1.deStyle.borderWidth === '5px', "Border width is 5px.");
    
    v1.setBorderStyle('solid');
    
    ok(v1.borderStyle === 'solid', "Border style is now solid.");
    ok(v1.deStyle.borderStyle === 'solid', "Border style is solid.");
    
    v1.setBorderColor('#ffffff');
    
    ok(v1.borderColor === '#ffffff', "Border color is now #ffffff.");
    ok(v1.deStyle.borderColor === 'rgb(255, 255, 255)', "Border color is now rgb(255, 255, 255).");
    
    v1.setBorder(null);
    
    ok(v1.borderWidth === 0, "Border width is now 0.");
    ok(v1.deStyle.borderWidth === '0px', "Border width is now 0px.");
    
    ok(v1.borderStyle === 'none', "Border style is now none.");
    ok(v1.deStyle.borderStyle === 'none', "Border style is now none.");
    
    ok(v1.borderColor === '#000000', "Border color is now #000000.");
    ok(v1.deStyle.borderColor === 'rgb(0, 0, 0)', "Border color is now rgb(0, 0, 0).");
    
    v1.setBorder([2, 'dotted', '#ffffff']);
    
    ok(v1.borderWidth === 2, "Border width is now 2.");
    ok(v1.deStyle.borderWidth === '2px', "Border width is now 2px.");
    
    ok(v1.borderStyle === 'dotted', "Border style is now dotted.");
    ok(v1.deStyle.borderStyle === 'dotted', "Border style is now dotted.");
    
    ok(v1.borderColor === '#ffffff', "Border color is now #ffffff.");
    ok(v1.deStyle.borderColor === 'rgb(255, 255, 255)', "Border color is now rgb(255, 255, 255).");
    
    v1.setBorderWidth();
    
    ok(v1.borderWidth === 0, "Border width is now 0.");
    ok(v1.deStyle.borderWidth === '0px', "Border width is now 0px.");
    
    v1.setBorderStyle(false);
    
    ok(v1.borderStyle === 'none', "Border style is now none.");
    ok(v1.deStyle.borderStyle === 'none', "Border style is now none.");
    
    v1.setBorderColor(0);
    
    ok(v1.borderColor === '#000000', "Border color is now #000000.");
    ok(v1.deStyle.borderColor === 'rgb(0, 0, 0)', "Border color is now rgb(0, 0, 0).");
    
    v.destroy();
});