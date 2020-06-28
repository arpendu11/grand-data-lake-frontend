import React, { useRef } from 'react';
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import '../index.css';

const initDiagram = () => {
    const $ = go.GraphObject.make;
    // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
    const diagram =
        $(go.Diagram,
            {
                maxSelectionCount: 1, // users can select only one part at a time
                validCycle: go.Diagram.CycleDestinationTree, // make sure users can only create trees
                // "clickCreatingTool.archetypeNodeData": { // allow double-click in background to create a new node
                //   name: "(new person)",
                //   title: "",
                //   comments: ""
                // },
                // "clickCreatingTool.insertPart": function(loc) {  // scroll to the new node
                //   var node = go.ClickCreatingTool.prototype.insertPart.call(this, loc);
                //   if (node !== null) {
                //     this.diagram.select(node);
                //     this.diagram.commandHandler.scrollToPart(node);
                //     this.diagram.commandHandler.editTextBlock(node.findObject("NAMETB"));
                //   }
                //   return node;
                // },
                layout:
                    $(go.TreeLayout,
                        {
                            treeStyle: go.TreeLayout.StyleLastParents,
                            arrangement: go.TreeLayout.ArrangementHorizontal,
                            // properties for most of the tree:
                            angle: 90,
                            layerSpacing: 35,
                            // properties for the "last parents":
                            alternateAngle: 90,
                            alternateLayerSpacing: 35,
                            alternateAlignment: go.TreeLayout.AlignmentBus,
                            alternateNodeSpacing: 20
                        }),
                "undoManager.isEnabled": true // enable undo & redo
            });

    const levelColors = ["#AC193D", "#2672EC", "#8C0095", "#5133AB",
        "#008299", "#D24726", "#008A00", "#094AB2"];

    // override TreeLayout.commitNodes to also modify the background brush based on the tree depth level
    diagram.layout.commitNodes = function () {
        go.TreeLayout.prototype.commitNodes.call(diagram.layout);  // do the standard behavior
        // then go through all of the vertexes and set their corresponding node's Shape.fill
        // to a brush dependent on the TreeVertex.level value
        diagram.layout.network.vertexes.each(function (v) {
            if (v.node) {
                var level = v.level % (levelColors.length);
                var color = levelColors[level];
                var shape = v.node.findObject("SHAPE");
                if (shape) shape.stroke = $(go.Brush, "Linear", { 0: color, 1: go.Brush.lightenBy(color, 0.05), start: go.Spot.Left, end: go.Spot.Right });
            }
        });
    };

    // This function provides a common style for most of the TextBlocks.
    // Some of these values may be overridden in a particular TextBlock.
    const textStyle = () => {
        return { font: "9pt  Segoe UI,sans-serif", stroke: "white" };
    };

    // This converter is used by the Picture.
    const findHeadShot = (photo) => {
        if (photo === "") return "../../img/images/HSnopic.png"; // There are only 16 images on the server
        return "../../img/images/HSnopic.png";
    };



    // define a simple Node template
    diagram.nodeTemplate =
        $(go.Node, 'Auto',  // the Shape will go around the TextBlock
            // for sorting, have the Node.text be the data.name
            new go.Binding("text", "name"),
            // bind the Part.layerName to control the Node's layer depending on whether it isSelected
            new go.Binding("layerName", "isSelected", function (sel) { return sel ? "Foreground" : ""; }).ofObject(),
            $(go.Shape, "Rectangle",
                {
                    name: "SHAPE", fill: "#333333", stroke: 'white', strokeWidth: 3.5,
                    // set the port properties:
                    portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer"
                }),
            $(go.Panel, "Horizontal",
                $(go.Picture,
                    {
                        name: "Picture",
                        desiredSize: new go.Size(70, 70),
                        margin: 1.5,
                    },
                    new go.Binding("source", "photo", findHeadShot)),
                // define the panel where the text will appear
                $(go.Panel, "Table",
                    {
                        minSize: new go.Size(130, NaN),
                        maxSize: new go.Size(150, NaN),
                        margin: new go.Margin(6, 10, 0, 6),
                        defaultAlignment: go.Spot.Left
                    },
                    $(go.RowColumnDefinition, { column: 2, width: 4 }),
                    $(go.TextBlock, textStyle(),  // the name
                        {
                            row: 0, column: 0, columnSpan: 5,
                            font: "12pt Segoe UI,sans-serif",
                            editable: true, isMultiline: false,
                            minSize: new go.Size(10, 16)
                        },
                        new go.Binding("text", "name").makeTwoWay()),
                    $(go.TextBlock, "Title: ", textStyle(),
                        { row: 1, column: 0 }),
                    $(go.TextBlock, textStyle(),
                        {
                            row: 1, column: 1, columnSpan: 4,
                            editable: true, isMultiline: false,
                            minSize: new go.Size(10, 14),
                            margin: new go.Margin(0, 0, 0, 3)
                        },
                        new go.Binding("text", "title").makeTwoWay()),
                    $(go.TextBlock, textStyle(),
                        { row: 2, column: 0 },
                        new go.Binding("text", "key", function (v) { return "ID: " + v; })),
                    $(go.TextBlock, textStyle(),
                        { name: "boss", row: 2, column: 3, }, // we include a name so we can access this TextBlock when deleting Nodes/Links
                        new go.Binding("text", "parent", function (v) { return "Boss: " + v; })),
                    $(go.TextBlock, textStyle(),  // the comments
                        {
                            row: 3, column: 0, columnSpan: 5,
                            font: "italic 9pt sans-serif",
                            wrap: go.TextBlock.WrapFit,
                            editable: true,  // by default newlines are allowed
                            minSize: new go.Size(10, 14)
                        },
                        new go.Binding("text", "comments").makeTwoWay())
                )  // end Table Panel
            ) // end Horizontal Panel
        );  // end Node

    // define the Link template
    diagram.linkTemplate =
        $(go.Link, go.Link.Orthogonal,
            { corner: 5, relinkableFrom: true, relinkableTo: true },
            $(go.Shape, { strokeWidth: 1.5, stroke: "#F5F5F5" }));  // the link shape

    return diagram;
}

/**
   * This function handles any changes to the GoJS model.
   * It is here that you would make any updates to your React state, which is dicussed below.
   */
const handleModelChange = () => {
    alert('GoJS model changed!');
}

const GoOrgChart = ({ data }) => {
    const wrapperRef = useRef();

    return (
        <div ref={wrapperRef}>
            <ReactDiagram
                initDiagram={initDiagram}
                divClassName='diagram-component'
                class={go.TreeModel}
                nodeDataArray={data}
                // linkDataArray={[
                //     { key: -1, from: 0, to: 1 },
                //     { key: -2, from: 0, to: 2 },
                //     { key: -3, from: 1, to: 1 },
                //     { key: -4, from: 2, to: 3 },
                //     { key: -5, from: 3, to: 0 }
                // ]}
                onModelChange={handleModelChange}
            />
        </div>
    );
};

export default GoOrgChart;