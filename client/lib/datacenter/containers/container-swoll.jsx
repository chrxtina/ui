import React from "react";
import h from "../../helpers";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import MyResponsiveLine from "../../../shared/nivo-databiz/line";

class ContainerSwoll extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      pod: props.pod,
      container: props.container,
      data: [],
      plot: [],
      type: "totals",
      kind: "classifications"
    };
  }

  componentDidMount() {
    this.getSwollData();
  };

   handleChange(e) {
    this.setState({
      kind: e.target.value,
    }, () => {
      this.setState({
        plot: this.processData(this.state.data.Metrics)
      });
    });
  };

  processData(data) {
    const type = this.state.type;
    const kind = this.state.kind;
    let result = Object.keys(data[kind]).map((key) => {
      let entry = {
        id: key,
        color: "#ffa",
        data: []
      };
      data[kind][key][type].map((plot) => {
        entry.data.push({
          x: plot.timestamp,
          y: Number(plot.value)
        });

      });
      return entry;
    });
    return result;
  }

  getSwollData() {
    let self = this;
    let pod = self.props.pod;
    let container = self.props.container;

    let ns = window.localStorage["csos-namespace"];

    let swTotalRateUrl = `/swoll/metrics/namespaces/${ns}/pods/${pod}/containers/${container}`;

    self.tmpRequest = h.fetch({
      dataType: "json",
      endpoint: swTotalRateUrl,
      resUrl: false,
      success: function(data) {
        self.tmpRequest = null;

        if (data.context.result) {
          data = data.context.result;
        }
        const plot = self.processData(data.Metrics);
        self.setState({
          data,
          plot
        });
      }
    });
  };

  render() {
    let data = this.state.plot;
    return (
      <div className="container-swoll-parent">
        <RadioGroup
        className="r-options"
        row aria-label="grouping"
        name="grouping"
        defaultValue="classifications"
        onChange={(e) => this.handleChange(e)}
      >
          <FormControlLabel value="classifications" control={<Radio />} label="Classifications" labelPlacement="end" />
          <FormControlLabel value="errors" control={<Radio />} label="Errors" />
          <FormControlLabel value="syscalls" control={<Radio />} label="System calls" />
        </RadioGroup>
        <MyResponsiveLine data={data} />
      </div>
    );
  }
}

export default ContainerSwoll;
