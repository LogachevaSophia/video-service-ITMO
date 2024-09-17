import { CardProfile } from "../components/Profile/CardProfile"
import { HistoryBuys } from "../components/Profile/HistoryBuys"


export const Profile = () => {
    return (
        <section style={{padding: "20px", display: "flex", gap: "var(--g-spacing-10)", flexWrap: "wrap"}}>
            <CardProfile srcImage={"https://loremflickr.com/640/480/cats?lock=8610182282084352"} />
            <HistoryBuys/>
        </section>
    )

}