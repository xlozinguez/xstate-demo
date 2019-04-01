import React from 'react';
import { useMachine } from 'use-machine';
import {
    AppBar,
    Checkbox,
    createStyles,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Theme,
    Toolbar,
    Typography,
    withStyles,
    WithStyles,
} from '@material-ui/core';
import { 
    Close,
    FolderShared,
    Menu,
} from '@material-ui/icons';
import deepPurple from '@material-ui/core/colors/deepPurple';
import { 
    appMachineConfig,
    appMachineOptions
} from './app.machine'

interface IFile {
    id: Number
    title: String
    owner: String
    updatedAt: Date
}

interface ISelecteableFile extends IFile{
    selected: Boolean
}

const styles = (theme: Theme) => createStyles({
    root: {
        flexGrow: 1,
    },
    bar: {
        backgroundColor: theme.palette.common.black,
    },
    selecting: {
        backgroundColor: deepPurple[500],
    },
    list: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    menuButton: {
        marginLeft: -18,
        marginRight: 10,
    }
});
interface IAppProps extends WithStyles<typeof styles> {}

const App = (props: IAppProps) => {
    const { classes } = props;
    const appState = useMachine(appMachineConfig, appMachineOptions);
    
    const itemList: ISelecteableFile[] = appState.context.items.map((item: IFile) => ({
        ...item,
        selected: appState.context.selectedItems.findIndex((selectedItem: IFile) => selectedItem.id === item.id) >= 0
    }));
    
    const allItemsSelected: boolean = appState.context.selectedItems.length === appState.context.items.length;

    const toggleSelectItem = (item: ISelecteableFile) => item.selected ? appState.send({ type: "DESELECT_ITEM", item }) : appState.send({ type: "SELECT_ITEM", item });
    const toggleSelectAll = () => allItemsSelected ? appState.send({ type: "RESET_SELECTION" }) : appState.send({ type: "SELECT_ALL_ITEMS" });
    const resetSelection = () => appState.send({ type: "RESET_SELECTION" });

    return (
        <div className={classes.root}>
            <AppBar position="static" className={appState.state.matches('selecting') ? classes.selecting : classes.bar}>
                <Toolbar>
                    {
                        appState.state.matches('selecting') ?
                        (<IconButton
                            onClick={resetSelection}
                            className={classes.menuButton} 
                            color="inherit" 
                            aria-label="Reset Selection">
                            <Close />
                        </IconButton>)
                        :
                        (<IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                            <Menu />
                        </IconButton>)
                    }
                    <Typography variant="h6" color="inherit">
                        My files
                    </Typography>
                </Toolbar>
            </AppBar>
            <Table aria-labelledby="tableTitle">
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox 
                                checked={allItemsSelected} 
                                onChange={toggleSelectAll}
                            />
                        </TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Owner</TableCell>
                        <TableCell>Last Modified</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {itemList.map((item: ISelecteableFile) => (
                        <TableRow
                            hover
                            onClick={() => toggleSelectItem(item)}
                            role="checkbox"
                            tabIndex={-1}
                            key={item.id as number}
                            selected={item.selected as boolean}
                        >
                            <TableCell padding="checkbox">
                                {
                                    appState.state.matches('browsing') ? 
                                    (<IconButton><FolderShared /></IconButton>)
                                    :
                                    (<Checkbox checked={item.selected as boolean}/>)
                                }
                            </TableCell>
                            <TableCell component="th" scope="row">{item.title}</TableCell>
                            <TableCell>{item.owner}</TableCell>
                            <TableCell>{item.updatedAt.toDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
};

export default withStyles(styles)(App);