import pandas as pd

def xlsx_to_txt(input_file, output_file):
    try:
        # read excel file
        df = pd.read_excel(input_file)

        # write DataFrame to txt file
        df.to_csv(output_file, sep='\t', index=False)  # use '\t' as seperator
        print("conversion successful")
    except Exception as e:
        print('error: ', e)


if __name__ == "__main__":
    input_file = 'NPS-Unit-List.xlsx'
    output_file = 'output.txt'
    xlsx_to_txt(input_file, output_file)