import clipboardy from 'clipboardy';

const ARROW_PATTERN = /\s*(.+)\s*=>\s*(.+)\s*/;
const JIRA_PATTERN = /\s*([+-])?\s*(\d+h)?\s*(\d+m)?\s*/;

const input = `

`;

const generateItems = () => {
    const lines = input.trim().split('\n');

    const arrowItems = [];
    const jiraItems = [];

    lines.forEach((x) => {
        if (ARROW_PATTERN.test(x)) {
            arrowItems.push(ARROW_PATTERN.exec(x).slice(1, 3));
        } else if (JIRA_PATTERN.test(x)) {
            const parts = JIRA_PATTERN.exec(x);
            jiraItems.push({
                isNegative: parts[1] === '-',
                hours: parts[2] ? +parts[2].replace('h', '') : 0,
                minutes: parts[3] ? +parts[3].replace('m', '') : 0,
            });
        }
    });

    return {arrowItems, jiraItems};
};

const calculateTimeSinceMidnight = (time) => {
    const [hour, minute] = time.split(':');
    return 60 * +hour + +minute;
};

const main = () => {
    const {arrowItems, jiraItems} = generateItems();

    let sum = 0;
    arrowItems.forEach(([start, end]) => (sum += calculateTimeSinceMidnight(end) - calculateTimeSinceMidnight(start)));
    jiraItems.forEach(({isNegative, hours, minutes}) => (sum += (isNegative ? -1 : 1) * (60 * hours + minutes)));

    const hour = Math.floor(sum / 60);
    const minute = sum % 60;

    const result = `${hour}h ${minute}m`;
    console.log(result);
    clipboardy.writeSync(result);
};

main();
console.log('Done!');
