import React from "react";
import { Flex, Box, Text, Button } from "rimble-ui";

// Address of the deployed smart contract (from etherscan)
const contractAddress = "0x0f69f0ac4b92bf0d101b5747eed3fa6b653a36f8";

// Copied from remix ide
const contractAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "balance",
        type: "int256",
      },
    ],
    name: "balanceUpdated",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "balances",
    outputs: [{ internalType: "int256", name: "", type: "int256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decrementCounter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getCount",
    outputs: [{ internalType: "int256", name: "", type: "int256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "incrementCounter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

class SmartContractControls extends React.Component {
  state = {
    value: 0,
    needsUpdate: false,
  };

  // gets the number stored in smart contract storage
  getNumber = ({ ...props }) => {
    try {
      this.props.contract.methods
        .getCount()
        .call()
        .then((value) => {
          value = Number(value.toString());
          this.setState({ value, needsUpdate: false });
          console.log("Updated number");
        })
        .catch((error) => {
          console.log(error);
          this.setState({ error });
        });
    } catch (error) {
      console.log("error", error);
    }
  };

  incrementCounter = () => {
    this.props.contractMethodSendWrapper("incrementCounter");
    this.getNumber();
  };

  decrementCounter = () => {
    this.props.contractMethodSendWrapper("decrementCounter");
    this.getNumber();
  };

  componentDidMount() {
    // Init the contract after the web3 provider has been determined
    this.props.initContract(contractAddress, contractAbi).then(() => {
      // Can finally interact with contract
      this.getNumber();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // this.processTransactionUpdates(prevProps);
  }

  render() {
    return (
      <Box>
        <Flex px={0} justifyContent="space-between" alignItems={"center"}>
          <Text fontWeight={3}>Smart contract value:</Text>
        </Flex>

        <Text
          fontSize={"5rem"}
          fontWeight={1}
          lineHeight={1}
          textAlign={"center"}
          my={5}
        >
          {this.state.value}
        </Text>

        <Flex flexDirection={"row"}>
          <Button onClick={this.decrementCounter} flex={"1"} mr={[2, 3]}>
            Decrease value
          </Button>
          <Button onClick={this.incrementCounter} flex={"1"}>
            Increase value
          </Button>
        </Flex>
      </Box>
    );
  }
}

export default SmartContractControls;
