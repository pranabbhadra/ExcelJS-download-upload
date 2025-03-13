generateExcel = async (formattedResult: any) => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Super admin Data");

            const currentTimeStamp = Date.now();

            // Define headers
            worksheet.columns = [
                { header: `FIRST NAME`, key: "first_name", width: 25 },
                { header: "LAST NAME", key: "last_name" },
                { header: "ROLE", key: "role" },
                { header: "DEPARTMENT", key: "department" },
                { header: "EMAIL", key: "email" },
                { header: "PHONE NUMBER", key: "phone" },
                { header: "STATUS", key: "status" },
            ];

            for (let data of formattedResult) {
                const rowData: any = {
                    first_name: data.first_name,
                    last_name: data.last_name,
                    role: data.role,
                    department: data.department,
                    email: data.email,
                    phone: data.phone,
                    status: data.status
                };

                worksheet.addRow(rowData);
            };

            // Set file path
            const filePath = path.join(__dirname, "../../../../public/uploads/", `${currentTimeStamp}_admin_users_list.xlsx`);
            console.log(filePath);

            // Write to file and send response
            await workbook.xlsx.writeFile(filePath);
            return filePath;

        } catch (error) {
            console.error("Error generating Excel file:", error);
            //res.status(500).send("Internal Server Error");
        }
    };

readExcel = async (filePath: string, headerMappings: Record<string, string>): Promise<{ data: object[] } | null> => {
		try {

			let errFlag = 0;
			const workbook = new ExcelJS.Workbook();
			await workbook.xlsx.readFile(filePath);

			const worksheet = workbook.getWorksheet(1);

			const headers: string[] = worksheet?.getRow(1).values as string[];
			let data: object[] = [];
			let response: any = {}
			response.status = true;
			response.headers = headers;

			worksheet?.eachRow((row, rowNumber) => {
				if (rowNumber !== 1) {
					const rowData: Record<string, any> = {};
					row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
						const columnName = headers[colNumber];

						const mappedHeader = headerMappings[columnName];

						if (!mappedHeader) {
							errFlag++;
						}
						rowData[mappedHeader] = typeof cell.value === 'string' ? cell.value.trim() : cell.value;
					});
					data.push(rowData);
				}
			});
			if (errFlag == 0) {
				response.status = true;
				response.data = data;
				return  response;
			} else {
				return null
			}
		} catch (error) {
			return null;
		}
	}
