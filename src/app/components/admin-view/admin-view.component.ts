import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductApi } from 'src/app/models/product.model';
import * as XLSX from 'xlsx';
import { ProductService } from 'src/app/services/productService/product.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.scss']
})

export class AdminViewComponent implements AfterViewInit, OnInit {

  closeResult = '';

  public product: ProductApi | any = {};
  public multidimensionalReadExcel: [][] | undefined;
  public ExcelDataJson: any;

  // Angular material table with pagination
  displayedColumns: string[] = ['Linea', 'Codigo', 'Tp', '_id',];
  dataSource = new MatTableDataSource<ProductApi>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private productService: ProductService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  //Buscar datos en api conectada a la base de datos atlas mongodb 
  getAllProducts() {
    this.productService.getAllProduct().subscribe({
      next: (res) => {
        this.dataSource.data = res;
      },
      error: (err) => {
        console.error(`Hemos tenido un error: ${err}`)
      },
      complete: () => console.info("Realizado con exito")
    })
  }

  //Convertir Excel a JSON

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.multidimensionalReadExcel = (XLSX.utils.sheet_to_json(ws, { header: 1 }));

      //Arreglo multidimensional sin la cabecera;
      let copiaSinCabecera: [][] = this.multidimensionalReadExcel.slice(1);
      this.prepareProductsOneByOne(copiaSinCabecera);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  //RECORRER EL ARREGLO PARA ENVIAR A LA API EL JSON
  //AL TRABAJAR EL EXCEL ORIGINAL TENDREMOS MUCHOS DATOS QUE AGREGAR, BUSCAR MEJOR OPCION

  prepareProductsOneByOne(listado: [][]) {
    listado.forEach(data => {

      data.forEach((elemento, indice) => {

        switch (indice) {
          case 0:
            this.product.Linea = elemento;
            break

          case 1:
            this.product.Codigo = elemento;
            break

          case 2:
            this.product.Tp = elemento;
            break
        }

      })

      this.saveProduct();
    })
    this.product = {};
  }


  // ENVIAR A LA API NODE JS CONECTADA A LA BASE DE DATOS ATLAS MONGODB
  saveProduct() {
    this.productService.registerProduct(this.product).subscribe({
      next: (res) => {
        this.product = {};
        this.ngOnInit();
        console.info(res)
      },
      error: (err) => {
        console.error(`Hemos tenido un error: ${err}`)
      },
      complete: () => console.info("Realizado con exito")
    })
  }

  //Generar un listado para borrar
  deleteProductsOneByOne() {
    this.dataSource.data.forEach((dataDelete) => {
      this.product = dataDelete;
      this.deleteProduct();
    })
    this.dataSource.data = [];
    this.refresh();
  }

  //Borrar producto
  deleteProduct() {
    let id: any = this.product._id;
    this.productService.deleteProduct(id).subscribe({
      next: (res) => {
        console.info(res)
      },
      error: (err) => {
        console.error(`Hemos tenido un error: ${err}`)
      },
      complete: () => console.info("Realizado con exito")
    });
  }

  deleteProductById(id: string) {
    this.productService.deleteProduct(id).subscribe({
      next: (res) => {
        this.product = {};
        this.ngOnInit();
        console.info(res)
      },
      error: (err) => {
        console.error(`Hemos tenido un error: ${err}`)
      },
      complete: () => console.info("Realizado con exito")
    });
  }

  //REFRESCAR INFORMACIÓN
  refresh(): void { window.location.reload(); }

  //GUARDAR JSON EN EXCEL
  convertJsonToExcel() {
    const workSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, "students")
    // Generate buffer
    XLSX.write(workBook, { bookType: 'xlsx', type: "buffer" })

    // Binary string
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" })

    XLSX.writeFile(workBook, "studentsData.xlsx")

    this.deleteProductsOneByOne()
    this.refresh();

  }


  //actualizar
  updateProductById(id: string) {
    let productAux: ProductApi = this.dataSource.data.filter((obj) => obj._id === id)[0];
    productAux.Linea = "Caballo";
    console.log(productAux)
    this.productService.updateProduct(productAux).subscribe({
      next: (res) => {
        this.product = {};
        this.ngOnInit();
        console.info(res)
      },
      error: (err) => {
        console.error(`Hemos tenido un error: ${err}`)
      }
    });
  }

  doLogout() {
    // this.authService.logout();
    // this.router.navigateByUrl('login');
  }

  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' }, 
    // { ariaLabelledBy: 'modal-basic-title' }
    ).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}