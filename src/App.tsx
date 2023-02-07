import { Button, FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

interface Data {
    tmb: number;
    weigth: number;
    objective: "bulking" | "cutting";
    superavit: number;
    deficit: number;
}

interface Macro {
    name: string;
    grams: number;
    calories: number;
}

function App() {

    const [data, setData] = useState<Data>({
        tmb: 0,
        weigth: 0,
        objective: "bulking",
        superavit: 0,
        deficit: 0
    })

    const [macros, setMacros] = useState<Macro[]>([])

    const [totalCalories, setTotalCalories] = useState<number>(0)

    const maskDecimal = (value: string) => {
        return Number(value.replace(/[^0-9.]/g, ''))
    }

    const handleTmbChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setData({ ...data, tmb: maskDecimal(e.target.value) })
    }

    const handleWeigthChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setData({ ...data, weigth: maskDecimal(e.target.value) })
    }

    const handleDeficitChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setData({ ...data, deficit: maskDecimal(e.target.value) })
    }

    const handleSuperavitChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setData({ ...data, superavit: maskDecimal(e.target.value) })
    }

    const handleObjectiveChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const option = e.target.value == "bulking" ? "bulking" : "cutting"
        setData({ ...data, objective: option })
    }

    const handleTotalCalories = () => {
        let totalCalories = data.objective == "bulking" ? data.tmb + data.superavit : data.tmb - data.deficit
        return totalCalories
    }

    const handleClean = () => {
        setData({
            tmb: 0,
            weigth: 0,
            objective: "bulking",
            superavit: 0,
            deficit: 0
        })
        setMacros([])
        setTotalCalories(0)
    }

    const handleMacro = () => {
        const totalCalories: number = handleTotalCalories()
        const proteins: Macro = {
            name: "Proteína",
            grams: data.weigth * 2,
            calories: (data.weigth * 2) * 4
        }
        const fat: Macro = {
            name: "Gordura",
            grams: data.weigth * 0.8,
            calories: (data.weigth * 0.8) * 9
        }
        const carbs: Macro = {
            name: "Carboidrato",
            grams: (totalCalories - (proteins.calories + fat.calories)) / 4,
            calories: totalCalories - (proteins.calories + fat.calories)
        }

        let arrMacros = [proteins, fat, carbs]
        setMacros(arrMacros)
        setTotalCalories(totalCalories)
        console.log(macros)
    }

    return (
        <Grid container gap={3} justifyContent="center" display='flex' flexDirection='column' alignContent='center'>
            <Grid item xs={12} md={4}>
                <Typography>Insira sua taxa metabólica basal, se você não souber acesse: <a href="https://www.unimed.coop.br/portalunimed/aplicativos/tmb/">https://www.unimed.coop.br/portalunimed/aplicativos/tmb/</a></Typography>

            </Grid>
            <Grid item xs={12} md={4}>
                <TextField
                    type='text'
                    label="Taxa metabólica basal (TMB)"
                    value={data.tmb}
                    onChange={handleTmbChange}
                    fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField
                    type='text'
                    label="Peso (Kg)"
                    value={data.weigth}
                    onChange={handleWeigthChange}
                    fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
                <FormControl>
                    <FormLabel>Selecione o objetivo: </FormLabel>
                    <RadioGroup row
                        value={data.objective}
                        onChange={handleObjectiveChange}
                    >
                        <FormControlLabel value="bulking" control={<Radio />} label="Bulking" />
                        <FormControlLabel value="cutting" control={<Radio />} label="Cutting" />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
                {
                    data.objective == "bulking" ?
                        <TextField
                            label="Superávit Calorico"
                            helperText="É recomendado iniciar um superávit calórico a partir de 100 calorias."
                            value={data.superavit}
                            onChange={handleSuperavitChange}
                            fullWidth />
                        :
                        <TextField
                            label="Déficit Calorico"
                            helperText="É recomendado iniciar um défict calórico a partir de 100 calorias."
                            value={data.deficit}
                            onChange={handleDeficitChange}
                            fullWidth />
                }

            </Grid>
            <Grid item xs={12} md={4} gap={1} display='flex' >

                <Button color='inherit' variant='contained' onClick={handleClean}>Limpar</Button>
                <Button variant='contained' onClick={handleMacro}>Calcular</Button>

            </Grid>
            <Grid item xs={12} md={4}>
                {
                    macros &&
                    <TableContainer component={Paper}>
                        <Table size='medium'>
                            <TableHead>
                                <TableRow>
                                    <TableCell >Macro</TableCell>
                                    <TableCell >Gramas</TableCell>
                                    <TableCell >Calorias</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {macros.map(macro => (
                                    <TableRow
                                        key={macro.name}
                                    >
                                        <TableCell >
                                            {macro.name}
                                        </TableCell>
                                        <TableCell >{macro.grams}g</TableCell>
                                        <TableCell >{macro.calories} cal</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell>

                                        <Typography>Total de calorias: {totalCalories}</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                }
            </Grid>
        </Grid>);
}

export default App;