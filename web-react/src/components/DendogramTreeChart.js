/* eslint-disable react/display-name */
import React, { useRef } from 'react';
import { NetworkFrame } from "semiotic";
const theme = ["#ac58e5", "#E0488B", "#9fd0cb", "#e0d33a", "#7566ff", "#533f82", "#7a255d", "#365350", "#a19a11", "#3f4482"];

const quantitativeColors = [
    "#f1cbd5",
    "#f989a4",
    "#fa217f",
    "#a64d6c",
    "#887177"
];

const DendogramTreeChart = ({ data }) => {
    const wrapperRef = useRef();
    console.log(data.parent[0].parent);
    const frameProps = {
        nodes: data.parent[0].parent,
        size: [700, 400],
        margin: 10,
        networkType: {
            type: "tree", // Could also be "cluster"
            zoom: true, // Zoom the laid out nodes in or out so that they fit the specified size, can also be "stretch" if you want zoom not to maintain aspect ratio
            padding: 0, // Pixel value to separate individual nodes from each other
            projection: "vertical", // Accepts (vertical|horizontal|radial) whether to display the chart with steps laid out on the y axis (vertical) or the x axis (horizontal)
            hierarhcySum: d => d.value, // Function for summing up children values into parent totals
            hierarchyChildren: d => d.children // Function describing how children are defined in the hierarchical dataset, which will be passed as the second value to d3-hierarchy’s hierarchy function
        },
        nodeIDAccessor: "id",
        nodeSizeAccessor: 20,
        customNodeIcon: d => (
            // <img src={d.d.data.photo}
            //     alt={d.d.data.firstName}
            <rect
                width={d.degree}
                height={d.degree}
                x={-d.degree / 2}
                y={-d.degree / 2}
                style={{
                    fill: d.createdByFrame ? "rgb(0, 162, 206)" : "rgb(179, 51, 29)"
                }}
            />
        ),
        nodeStyle: d => ({
            fill: quantitativeColors[d.depth],
            stroke: theme[d.depth],
            fillOpacity: 0.6
        }),
        edgeStyle: d => ({
            fill: theme[d.source.depth],
            stroke: quantitativeColors[d.source.depth],
            opacity: 0.5
        }),
        filterRenderedNodes: d => d.depth !== 0,
        hoverAnnotation: [
            { type: "desaturation-layer", style: { fill: "white", fillOpacity: 0.25 } },
            {
                type: "highlight",
                style: d => ({
                    fill: theme[d.depth],
                    stroke: theme[d.depth],
                    fillOpacity: 0.6
                })
            },
            { type: "frame-hover" }
        ],
        tooltipContent: d => (
            <div className="tooltip-content">
                {/* {d.parent[0] ? <p>{d.parent[0].data.name}</p> : <p>{d.data.name}</p>} */}
                <p>{d.name}</p>
            </div>),
        nodeLabels: d => {
            return d.depth > 1 ? null : (
                <g transform="translate(0,-15)">
                    <text
                        fontSize="12"
                        textAnchor="middle"
                        strokeWidth={2}
                        stroke="white"
                        fill="white"
                    >
                        {d.firstName}
                    </text>
                    <text fontSize="12" textAnchor="middle" fill={theme[d.depth]}>
                        {d.firstName}
                    </text>
                </g>
            )
        }
    };

    return <div ref={wrapperRef}>
        <NetworkFrame {...frameProps} />
    </div>
};

export default DendogramTreeChart;