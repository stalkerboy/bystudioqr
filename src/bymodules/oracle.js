import OracleDB from "oracledb";

export const dbexecute = async function (sql, binds) {
  let conn;
  let results;
  try {
    conn = await OracleDB.getConnection();
    results = await conn.execute(sql, binds, { autoCommit: true });
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) {
      try {
        // Put the conn back in the pool
        await conn.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
  return results;
};

export const dbexecuteCur = async function (sql, binds) {
  let conn;
  let result;
  let numRows = 500; //maxNumRows
  let rows;
  let metaData;
  try {
    conn = await OracleDB.getConnection();
    if (binds) result = await conn.execute(sql, binds, { autoCommit: true });
    else result = await conn.execute(sql);

    const resultSet = result.outBinds.cursor;

    metaData = result.outBinds.cursor.metaData;
    do {
      rows = await resultSet.getRows(numRows); // get numRows rows at a time
      // if (rows.length > 0) {
      //     console.log(rows);
      // }
    } while (rows.length === numRows);
    // always close the ResultSet
    await resultSet.close();
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) {
      try {
        // Put the conn back in the pool
        await conn.close();
      } catch (err) {
        console.error(err);
      }
    }
  }

  return { metaData, rows };
};

export const dbexecuteMany = async function (sql, binds) {
  let conn;
  let result;
  try {
    conn = await OracleDB.getConnection();
    result = await conn.executeMany(sql, binds, { autoCommit: true });
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) {
      try {
        // Put the conn back in the pool
        await conn.close();
      } catch (err) {
        console.error(err);
      }
    }
  }

  return result;
};

export const dbParseResult = function (result) {
  const parsedresult = [];
  result.rows.forEach((row) => {
    const dic = {};
    result.metaData.forEach((meta, index) => {
      dic[meta.name] = row[index];
    });
    parsedresult.push(dic);
  });
  return parsedresult;
};
