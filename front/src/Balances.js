import React, { useEffect, useState } from 'react';
import { Table, Grid, Button } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSubstrate } from './substrate-lib';
import { getContract } from './Contract';


export default function Main(props) {
  const { api, keyring } = useSubstrate();
  const accounts = keyring.getPairs();
  const [balances, setBalances] = useState({});

  const contract = getContract(api);
  
  const getBalanceOf = async (address) => {
    return contract.query.balanceOf(address, 0, -1, address);
  };

  const getAllBalances = async (addresses) => {
    return Promise.all(
      addresses.map((address) =>
        getBalanceOf(address).then((result) => ({
          ...result,
          address,
        }))
      )
    );
  };

  useEffect(() => {
    const addresses = keyring.getPairs().map((account) => account.address);
    let unsubscribeAll = null;

    (async function anyNameFunction() {
      const allBalances = await getAllBalances(addresses);
      let balanceMap = {};
      allBalances.map((data) => {
        debugger
        if (data.result.isOk) {
          balanceMap[data.address] = data.output.toHuman();
        }
      });
      setBalances(balanceMap);
    })();

    return () => unsubscribeAll && unsubscribeAll();
  }, [api, keyring, setBalances]);

  return (
    <Grid.Column>
      <h1>Balances</h1>
      <Table celled striped size='small'>
        <Table.Body>{accounts.map(account =>
          <Table.Row key={account.address}>
            <Table.Cell width={3} textAlign='right'>{account.meta.name}</Table.Cell>
            <Table.Cell width={10}>
              <span style={{ display: 'inline-block', minWidth: '31em' }}>
                {account.address}
              </span>
              <CopyToClipboard text={account.address}>
                <Button
                  basic
                  circular
                  compact
                  size='mini'
                  color='blue'
                  icon='copy outline'
                />
              </CopyToClipboard>
            </Table.Cell>
            <Table.Cell width={3}>{
              balances && balances[account.address] &&
              balances[account.address]
            }</Table.Cell>
          </Table.Row>
        )}
        </Table.Body>
      </Table>
    </Grid.Column>
  );
}
