class App extends React.Component {
  makeChart() {
    var margin = {
      top: 70,
      right: 20,
      bottom: 50,
      left: 100,
    }
    var fullWidth = 800
    var fullHeight = 600

    var width = fullWidth - margin.left - margin.right
    var height = fullHeight - margin.top - margin.bottom

    var svg = d3.select("#ChartContainer").append("svg")
      .attr("width", fullWidth)
      .attr("height", fullHeight)

    svg.append("rect")
      .attr("class", "Background")
      .attr("width", fullWidth)
      .attr("height", fullHeight)
      .attr("rx", 10)
      .attr("ry", 10)

    // Chart title
    var title = svg.append("text")
      .attr("class", "ChartTitle")
      .attr("x", 10)
      .attr("y", 10)
      .attr("dy", "1em")
      .text("Gross Domestic Product (GDP), USA")

    var x = d3.scaleBand()
        .range([0, width])
    var xTime = d3.scaleTime()
      .range([0, width])
    var y = d3.scaleLinear()
      .range([height, 0])

    var g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    d3.json(
      "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json",
      (error, data) => {
        if (error) throw error
        x.domain(data.data.map(item => item[0]))
        y.domain([0, d3.max(data.data, item => item[1])])
        var timeFormatter = d3.timeParse("%Y-%m-%d")
        xTime.domain(data.data.map(item => timeFormatter(item[0])))

        var currencyFormat = d3.format("$,.0f")

        g.selectAll(".Bar")
          .data(data.data)
          .enter().append("rect")
          .attr("class", "Bar")
          .attr("x", item => x(item[0]))
          .attr("y", item => y(item[1]))
          .attr("width", x.bandwidth())
          .attr("height", item => (height - y(item[1])))
          .attr("data-toggle", "tooltip")
          .attr("title", item => {
            var date = new Date(item[0])
            date = date.toLocaleDateString("en-us", {month: "short", year: "numeric"})
            return date + "<br /><b>" + currencyFormat(item[1]) + " billion</b>"
          })

        g.selectAll(".Bar").each(function (data, item) {
          $(this).tooltip({html: true})
        }
         )

        // x-axis
        var xAxis = g.append("g")
          .attr("class", "axis axis-x")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x)
            .tickValues(  // Filter only beginning of years
              x.domain().filter((item, index, arr) => {
                if (index === 0 || index === arr.length -1) return true
                let prevYear = (new Date(arr[index - 1])).getFullYear()
                let curYear = (new Date(item)).getFullYear()
                return (curYear !== prevYear)
              }).filter((item, index) => !(index % 5))  // Every 5 years
            )
            .tickFormat((data, index) => {
              return (new Date(data)).getFullYear()
            })
          )

        // x-axis Label
        g.append("text")
          .attr("class", "AxisLabel")
          .attr("x", (width / 2))
          .attr("y", height + margin.bottom - 10)
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "baseline")
          .text("Date")

        // y-axis
        var yAxis = g.append("g")
          .attr("class", "axis axis-y")
          .call(d3.axisLeft(y)
            .tickFormat(currencyFormat)
          )

        // y-axis Label
        g.append("text")
          .attr("class", "AxisLabel")
          .attr("transform", "rotate(-90)")
          .attr("x", 0 - (height / 2))
          .attr("y", 0 - margin.left + 10)
          .attr("dy", "1.0em")
          .attr("text-anchor", "middle")
          .text("GDP (in billions)")

      }
    )
  }
  componentDidMount() {
    this.makeChart()
  }
  render() {
    return (
      <div className="container App">
        <div className="card">
          <div className="card-body">
            <h3>
              Data Visualization Example - Bar Chart
              {' '}<button
                type="button"
                className="btn btn-info btn-sm"
                data-toggle="modal"
                data-target="#InfoModal">Info</button>
            </h3>


            <div className="modal fade" id="InfoModal" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-body">
                    <p>
                      An example of data visualization of a bar charts in d3.js
                      with an equidistant time scale.
                    </p>
                    <div>Libraries used in this example:</div>
                    <ul>
                      <li>D3.js</li>
                      <li>Bootstrap (tooltipes)</li>
                      <li>React</li>
                    </ul>
                    <p className="small">Written by Boris Wong, December 2017. MIT license.</p>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div id="ChartContainer"></div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
