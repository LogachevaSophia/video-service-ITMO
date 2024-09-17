import { Card, Flex, Label, Table, Text } from "@gravity-ui/uikit"
import styles from './Card.module.css'

export const HistoryBuys = () => {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    type Item = { id: number; Date: JSX.Element, Status: JSX.Element, Price: JSX.Element };
    const generateDate = () => {
        const today = new Date();
        const day = today.getDate();
        const month = monthNames[today.getMonth()];
        return (
            <div style={{width:"min-content", paddingLeft:"20px"}}>
                <Flex direction={"column"} alignItems={"center"} gap={0}>
                    <Text className={styles.dateHeader}>{day}</Text><br></br>
                    <Text className={styles.dateMonth}>{month}</Text>
                </Flex>
            </div>

        )
    }
    const generateLabel = (flag: boolean) => {
        return (
            <>
                <Label theme={flag ? "success" : "danger"}>{flag ? "Success" : "Failure"}</Label>
            </>
        )
    }
    const generatePrice = (price: number) => {
        return(
            <Text className={styles.dateHeader}>{price} $</Text>
        )
    }
    const data: Item[] = [
        { id: 1, Date: generateDate(), Status: generateLabel(false), Price: generatePrice(10) },
        { id: 2, Date: generateDate(), Status: generateLabel(true), Price: generatePrice(1100) },
    ];
    const columns = [{ id: 'Date' }, { id: "Status" }, {id: "Price"}];
    return (
        <section style={{ width: "100%" }} className={styles.historyBuys}>
            <Card type="container" theme="normal" view={"outlined"}>
                <Table columns={columns} data={data} ></Table>
            </Card>

        </section>

    );
}