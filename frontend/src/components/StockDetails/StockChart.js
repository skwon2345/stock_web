import React, { useState, useEffect } from "react";
import axios from 'axios';
import Plot from 'react-plotly.js';
import { Modal, ModalOverlay,ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Checkbox, Table, Tr, Th, Thead, Tbody, Td } from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon ,EditIcon } from '@chakra-ui/icons'
import { useDisclosure } from '@chakra-ui/react'
import './styles.css'


export const StockChart =({stock_symbol}) => {
    const [data, setData] = useState([]);
    const [layout, setLayout] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [showTrend, setTrend] = useState({
        indicator: "Trend Line",
        show: true,
        windowSize: 20,
        eye: true,
    })
    const { isOpen, onOpen, onClose } = useDisclosure()

    const dataURL = `http://127.0.0.1:8000/api/candle/?symbol=${stock_symbol}&from=1900-01-01&to=2023-02-20&trend=${showTrend.show === true ? 1 : 0}&window=${showTrend.windowSize}`

    useEffect(() => {
        const initialValue = async () => {
            await axios.get(dataURL)
                .then(function(response) {
                response.data.layout.template.layout.yaxis.gridcolor= "#3B3B3B"
                response.data.layout.template.layout.xaxis.gridcolor= "none"
                setData(response.data.data)
                setLayout(layout=> ({
                    ...layoutOptions,
                    ...response.data.layout
                }))
            setLoading(false);
            })
        }
        initialValue();
    }, [dataURL])

    if(isLoading) {
        return null;
    }

    const handleChange = () => {
        setTrend(prev => ({...showTrend, show: !showTrend.show}))
    }
    
    const toggleEye = () => {
        setTrend(prev => ({...showTrend, eye: !showTrend.eye, show: !showTrend.show}))
    }

    return (
        <div className="stockChart">
            <Plot data={data} layout={layout} config={config}/>
                {/* <Button  className="trendModalButton" variant="contained" color="grey" size="sm" onClick={onOpen}> <EditIcon pr="1px"/> Indicators </Button> */}
                <ShowModal showTrend={showTrend} setTrend={setTrend} handleChange={handleChange} isOpen={isOpen} onClose={onClose}/>
                    <div className="indicatorList"> 
                        {showTrend.indicator} : {showTrend.windowSize} 
                        <div className="icons">
                            <p className="eye" onClick={handleChange}> {showTrend.show && showTrend.eye ? <ViewIcon onClick={toggleEye} pr="1px" boxSize={5}/> : <ViewOffIcon onClick={toggleEye} pb="2px" boxSize={5} /> }</p>
                            <p className="edit" onClick={onOpen} > <EditIcon /> </p> 
                        </div>
                    </div>
        </div>
    )
}

const ShowModal = ({ showTrend, setTrend, handleChange, isOpen, onClose }) => {
        return (
            <Modal className="modal" isOpen={isOpen} onClose={onClose} isCentered size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Indicator Option</ModalHeader>
                    <hr />
                    <ModalCloseButton />
                    <ModalBody>
                            <Table> 
                                <Thead>
                                    <Tr>
                                        <Th>Indicator</Th>
                                        <Th>Window size</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Td>
                                        Trend line 
                                        {/* <Checkbox size="lg" defaultChecked={(showTrend.show).toString()} ischecked={(!showTrend.show).toString()} onChange={handleChange}/>  */}
                                    </Td>
                                    <Td>
                                        <div>
                                            <input type="number" required className="windowSize" disabled={!showTrend.show} value={showTrend.windowSize} onChange={e => setTrend(prev => ({...showTrend, windowSize: e.target.value}))}/>
                                            <label> (1-100) </label> 
                                        </div>
                                    </Td>
                                </Tbody>
                            </Table>
                    </ModalBody>
                    <ModalFooter>
                        <Button borderRadius={10} mr={3} onClick={onClose}>
                        Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            )
    }

const config= {
    autoscale:true,
    autosize: true,
    responsive: true,
}

var selectorOptions = {
    buttons: [{
        step: 'month',
        stepmode: 'backward',
        count: 1,
        label: '1m'
    }, {
        step: 'month',
        stepmode: 'backward',
        count: 6,
        label: '6m'
    }, {
        step: 'year',
        stepmode: 'todate',
        count: 1,
        label: 'YTD'
    }, {
        step: 'year',
        stepmode: 'backward',
        count: 1,
        label: '1y'
    }, {
        step: 'all',
    }],
};

const layoutOptions = {
    font: {size: 13, color: "#c7c7c7"},
    width: 1100,
    height: 880,
    xaxis: {
        autorange: true, 
        showgrid: true,
        type: 'date',
        rangeselector: selectorOptions,
    }, 
    yaxis: {
            autorange: true, 
            type: 'candlestick',
            boundmode: 'hard',
            bounds: [50, 100],
            anchor: "x",
            overlaying: "y"
    },
    yaxis2: {
            autorange: false, 
            type: 'candlestick',
            boundmode: 'hard',
            bounds: [50, 100],
            overlaying: 'y',
            side: "right"
    },
    plot_bgcolor:"#242526",
    paper_bgcolor:"#242526"
};
